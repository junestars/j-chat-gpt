import styles from "./auth.module.scss";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";

import BotIcon from "../icons/bot.svg";
import { useEffect, useState } from "react";
import { getClientConfig } from "../config/client";

const NODE_SERVER_BASE_URL = process.env.NEXT_PUBLIC_NODE_SERVER_BASE_URL;

const parseJSON = (response: any) => {
  return response.json ? response.json() : response;
};

async function verifyCode(body: { phone: string; code: string }) {
  const url = `${NODE_SERVER_BASE_URL}/verify-code`;
  const data = JSON.stringify(body);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  });
  const res = await parseJSON(response);
  return res.statusCode === "000000" ? res : Promise.reject(res);
}

const sendCode = async (phone: number | string) => {
  const url = `${NODE_SERVER_BASE_URL}/send-code`;
  const data = JSON.stringify({ phone });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  });
  const res = await parseJSON(response);
  return res.statusCode === "000000" ? res : Promise.reject(res);
};

export function AuthPage() {
  const navigate = useNavigate();
  const access = useAccessStore();

  const [disableBtn, setDisableBtn] = useState(false);
  const [btnText, setBtnText] = useState("发送验证码");
  const [code, setCode] = useState(""); // 验证码
  const [phone, setPhone] = useState(""); // 手机号

  const goHome = () => {
    if (phone?.length === 11 && code?.length === 4) {
      verifyCode({ phone, code })
        .then((res) => {
          window.localStorage.setItem("user", "Bearer " + res.token);
          access.updateAuth("Bearer " + res.token);
          access.updatePhone(phone);
          navigate(Path.Home);
        })
        .catch((error) => {
          console.log("验证失败", error);
        });
    } else {
      console.log("请输入验证码或手机号");
    }
  };

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimer = () => {
    let time = 60;
    setBtnText(time.toString());
    setDisableBtn(true);

    const timer = setInterval(() => {
      time -= 1;
      if (time > 0) {
        setBtnText(time.toString());
      } else {
        setBtnText("发送验证码");
        setDisableBtn(false);
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleSendCode = () => {
    if (phone?.length !== 11) {
      return console.log("请输入正确的手机号");
    }

    handleTimer();

    sendCode(phone).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-main"]}>
        <div className={styles["code-input-wrap"]}>
          <label>手机号：</label>
          <input
            className={styles["auth-input"]}
            placeholder="请输入手机号"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.currentTarget.value);
            }}
          />
        </div>
        <div className={styles["code-input-wrap"]}>
          <label>验证码：</label>
          <input
            className={styles["auth-input"]}
            placeholder="请输入验证码"
            value={code}
            onChange={(e) => {
              setCode(e.currentTarget.value);
            }}
          />
          <button
            className={
              styles["code-input__btn"] +
              (disableBtn ? " " + styles["is-disabled"] : "")
            }
            onClick={handleSendCode}
            disabled={disableBtn}
          >
            {btnText}
          </button>
        </div>
        <div>
          <button className={styles["btn"]} onClick={goHome}>
            登录
          </button>
        </div>
      </div>
    </div>
  );
}
