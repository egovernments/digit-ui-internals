import React from "react";
import { useTranslation } from "react-i18next";
import { SubmitBar, ActionBar, Menu } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsActionBar({ workflowDetails, displayMenu, onActionSelect, setDisplayMenu, businessService }) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {!workflowDetails?.isLoading && workflowDetails?.data?.actionState?.nextActions?.length > 0 && (
        <ActionBar>
          {displayMenu && workflowDetails?.data?.actionState?.nextActions ? (
            <Menu
              localeKeyPrefix={`WF_EMPLOYEE_${businessService}`}
              // options={workflowDetails?.data?.actionState?.nextActions.map((action) => action?.action)}
              options={workflowDetails?.data?.actionState?.nextActions}
              optionKey={"action"}
              t={t}
              onSelect={onActionSelect}
            />
          ) : null}
          <SubmitBar label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
    </React.Fragment>
  );
}

export default ApplicationDetailsActionBar;
