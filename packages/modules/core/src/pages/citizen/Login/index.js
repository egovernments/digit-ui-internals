import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContainer, BackButton, Toast } from "@egovernments/digit-ui-react-components";
import { Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectOtp from "./SelectOtp";
import SelectName from "./SelectName";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user";

const Login = ({ stateCode, isUserRegistered = true }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [params, setParmas] = useState({});

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.UserService.setUser(user);
    const redirectPath = location.state?.from || "/digit-ui";
    history.replace(redirectPath);
  }, [user]);

  const stepItems = useMemo(() =>
    loginSteps.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginSteps]
    )
  );

  const getUserType = () => Digit.UserService.getType();

  const handleOtpChange = (otp) => {
    setParmas({ ...params, otp });
  };

  const handleMobileChange = (event) => {
    const { value } = event.target;
    setParmas({ ...params, mobileNumber: value });
  };

  const selectMobileNumber = async (mobileNumber) => {
    setParmas({ ...params, ...mobileNumber });
    const data = {
      ...mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };
    if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
      if (!err) {
        history.push(`${path}/otp`, { from: location.state?.from || "/digit-ui" });
        return;
      }
    } else {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
      if (!err) {
        history.push(`${path}/otp`, { from: location.state?.from || "/digit-ui" });
        return;
      }
    }
  };

  const selectName = async (name) => {
    const data = {
      ...params,
      tenantId: stateCode,
      userType: getUserType(),
    };
    setParmas({ ...params, ...name });
    history.push(`${path}`, { from: location.state?.from || "/digit-ui" });
  };

  const selectOtp = async () => {
    try {
      const { mobileNumber, otp, name } = params;
      if (isUserRegistered) {
        const requestData = {
          username: mobileNumber,
          password: otp,
          tenantId: stateCode,
          userType: getUserType(),
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
        setUser({ info, ...tokens });
      } else if (!isUserRegistered) {
        const requestData = {
          name,
          username: mobileNumber,
          otpReference: otp,
          tenantId: stateCode,
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.registerUser(requestData, stateCode);
        setUser({ info, ...tokens });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resendOtp = async () => {
    const { mobileNumber } = params;
    const data = {
      mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };
    if (!isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    } else if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
    }
  };

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

  return (
    <Switch>
      <AppContainer>
        <BackButton />
        <Route path={`${path}`} exact>
          <SelectMobileNumber
            onSelect={selectMobileNumber}
            config={stepItems[0]}
            mobileNumber={params.mobileNumber || ""}
            onMobileChange={handleMobileChange}
            showRegisterLink={isUserRegistered}
            t={t}
          />
        </Route>
        <Route path={`${path}/otp`}>
          <SelectOtp config={stepItems[1]} onOtpChange={handleOtpChange} onResend={resendOtp} onSelect={selectOtp} otp={params.otp} t={t} />
        </Route>
        <Route path={`${path}/name`}>
          <SelectName config={stepItems[2]} onSelect={selectName} t={t} />
        </Route>
        {error && <Toast error={true} label={error} onClose={() => setError(null)} />}
      </AppContainer>
    </Switch>
  );
};

export default Login;
