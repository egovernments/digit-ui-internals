import SelectRating from "../pages/citizen/Rating/SelectRating";
import FileComplaint from "../pages/citizen/FileComplaint/index";
import { NewApplication } from "../pages/employee/NewApplication";
import { MyApplications } from "../pages/citizen/MyApplications";
import ApplicationDetails from "../pages/citizen/ApplicationDetails";
import { FSMLinks } from "../Module";
import EmployeeApplicationDetails from "../pages/employee/ApplicationDetails";
import CollectPayment from "../pages/employee/CollectPayment";
import ApplicationAudit from "../pages/employee/ApplicationAudit";
import Response from "../pages/Response";
import EditApplication from "../pages/employee/EditApplication";
import Inbox from "../pages/employee/Inbox";
import FstpOperatorDetails from "../pages/employee/FstpOperatorDetails";
import FstpInbox from "../pages/employee/FstpInbox";
import SearchApplication from "../pages/employee/SearchApplication";

const ComponentMaster = (targetComponent) => {
  switch (targetComponent) {
    case "FileComplaint":
      return FileComplaint;
    case "MyApplications":
      return MyApplications;
    case "ApplicationDetails":
      return ApplicationDetails;
    case "SelectRating":
      return SelectRating;
    case "Response":
      return Response;
    case "FSMLinks":
      return FSMLinks;
    case "Inbox":
      return Inbox;
    case "FstpInbox":
      return FstpInbox;
    case "NewApplication":
      return NewApplication;
    case "EditApplication":
      return EditApplication;
    case "EmployeeApplicationDetails":
      return EmployeeApplicationDetails;
    case "FstpOperatorDetails":
      return FstpOperatorDetails;
    case "Response":
      return Response;
    case "CollectPayment":
      return CollectPayment;
    case "ApplicationAudit":
      return ApplicationAudit;
    case "SearchApplication":
      return SearchApplication;
  }
};

export default ComponentMaster;
