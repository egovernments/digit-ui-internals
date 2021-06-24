import ReactDOM from "react-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Download = {
  Image: (node, fileName, share, resolve = null) => {
    const saveAs = (uri, filename) => {
      const link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    };

    const element = ReactDOM.findDOMNode(node.current);
    html2canvas(element, {
      scrollY: -window.scrollY,
      scrollX: 0,
      useCORS: true,
      scale: 1.5,
    }).then((canvas) => {
      return share
        ? canvas.toBlob((blob) => resolve(new File([blob], `${fileName}.jpeg`, { type: "image/jpeg" })), "image/jpeg", 1)
        : saveAs(canvas.toDataURL("image/jpeg", 1), `${fileName}.jpeg`);
    });
  },

  PDF: (node, fileName, share) => {
    const getPDF = (canvas) => {
      const width = canvas.width;
      const height = canvas.height;
      const o = width > height ? "l" : "p";
      const format = "a4";

      return new jsPDF(o, "mm", format);
    };

    const element = ReactDOM.findDOMNode(node.current);
    return html2canvas(element, {
      scrollY: -window.scrollY,
      scrollX: 0,
      useCORS: true,
      scale: 1.5,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    }).then((canvas) => {
      const pdf = getPDF(canvas);
      const jpegImage = canvas.toDataURL("image/jpeg");
      const imgProps = pdf.getImageProperties(jpegImage);
      const margin = 0.1;
      const pageHeight = 295;
      const pdfWidth = pdf.internal.pageSize.width * (1 - margin);
      const x = pdf.internal.pageSize.width * (margin / 2);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let position = 10;
      let heightLeft = pdfHeight;
      pdf.addImage(jpegImage, "JPEG", x, position, pdfWidth, pdfHeight, "a", "FAST");
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position += heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(jpegImage, "JPEG", x, position, pdfWidth, pdfHeight, "a", "FAST");
        heightLeft -= pageHeight;
      }
      return share ? new File([pdf.output("blob")], `${fileName}.pdf`, { type: "application/pdf" }) : pdf.save(`${fileName}.pdf`);
    });
  },
};
export default Download;
