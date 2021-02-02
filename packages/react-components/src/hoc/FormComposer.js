import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import BreakLine from "../atoms/BreakLine";
import Card from "../atoms/Card";
import CardLabel from "../atoms/CardLabel";
import CardSubHeader from "../atoms/CardSubHeader";
import CardSectionHeader from "../atoms/CardSectionHeader";
import TextArea from "../atoms/TextArea";
import TextInput from "../atoms/TextInput";
import ActionBar from "../atoms/ActionBar";
import SubmitBar from "../atoms/SubmitBar";
import LabelFieldPair from "../atoms/LabelFieldPair";

import { useTranslation } from "react-i18next";

export const FormComposer = (props) => {
  const { register, handleSubmit, setValue, watch, control, formState } = useForm();
  const { t } = useTranslation();

  const formData = watch();

  function onSubmit(data) {
    props.onSubmit(data);
  }

  useEffect(() => {
    props.onFormValueChange && props.onFormValueChange(formData, formState);
  }, [formData]);

  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        // if (populators.defaultValue) setTimeout(setValue(populators.name, populators.defaultValue));
        return (
          <div
            className="field-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {populators.componentInFront ? (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {populators.componentInFront}
              </span>
            ) : null}
            <TextInput className="field" {...populators} inputRef={register(populators.validation)} />
          </div>
        );
      case "textarea":
        if (populators.defaultValue) setTimeout(setValue(populators.name, populators.defaultValue));
        return <TextArea className="field" {...populators} inputRef={register(populators.validation)} />;
      case "custom":
        return (
          <Controller
            render={(props) => populators.component({ ...props, setValue }, populators.customProps)}
            defaultValue={populators.defaultValue}
            name={populators.name}
            control={control}
          />
        );
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => {
        return (
          <React.Fragment key={index}>
            {section.head && <CardSectionHeader id={section.headId}>{section.head}</CardSectionHeader>}
            {section.body.map((field, index) => {
              const FieldPair = () => (
                <React.Fragment>
                  {!field.withoutLabel && (
                    <CardLabel style={props.inline && { marginBottom: "8px" }}>
                      {field.label}
                      {field.isMandatory ? " * " : null}
                    </CardLabel>
                  )}
                  <div style={field.withoutLabel ? { width: "100%" } : {}} className="field">
                    {fieldSelector(field.type, field.populators)}
                  </div>
                </React.Fragment>
              );

              if (props.inline) return <FieldPair key={index} />;
              return (
                <LabelFieldPair key={index}>
                  <FieldPair />
                </LabelFieldPair>
              );
            })}
            {array.length - 1 === index ? null : <BreakLine />}
          </React.Fragment>
        );
      }),
    [props.config]
  );

  const getCardStyles = () => {
    let styles = props.cardStyle || {};
    if (props.noBoxShadow) styles = { ...styles, boxShadow: "none" };
    return styles;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card style={getCardStyles()}>
        {!props.childrenAtTheBottom && props.children}
        {props.heading && <CardSubHeader>{props.heading}</CardSubHeader>}
        {formFields}
        {props.childrenAtTheBottom && props.children}
        {props.label && (
          <ActionBar>
            <SubmitBar label={t(props.label)} submit="submit" />
          </ActionBar>
        )}
      </Card>
    </form>
  );
};
