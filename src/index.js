import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import intl from "react-intl-universal";
import { ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";

import fhtCookie from "@common/utils/cookie";
import store from "@common/store/index";

import reportWebVitals from "./reportWebVitals";

const locales = {
  en: require("./static/i18n/en_US.js").default,
  zh: require("./static/i18n/zh_CN.js").default,
};

class Content extends Component {
  render() {
    return (
      <Fragment>
        <Route component={Error} />
        <Route path="/" exact render={() => <Redirect to="/example" />} />
      </Fragment>
    );
  }
}

class _App extends Component {
  state = {
    initDone: false,
  };

  componentDidMount = async () => {
    const { dispatch } = this.props;
    const locale = fhtCookie.getCookie("fht_locale") || "zh";

    await dispatch({
      type: "set-locale",
      val: locale,
    });

    this.loadLocales();
  };

  loadLocales() {
    const { locale } = this.props;

    if (locale === "en") {
      moment.locale("en");
    } else {
      moment.locale("zh-cn");
    }

    intl
      .init({
        currentLocale: locale,
        locales,
      })
      .then(() => {
        this.setState({
          initDone: true,
        });
      });
  }

  changeLocale = (locale = "zh") => {
    const { dispatch } = this.props;

    if (locale === "en") {
      moment.locale("en");
    } else {
      moment.locale("zh-cn");
    }

    dispatch({
      type: "set-locale",
      val: locale,
    });

    intl.options.currentLocale = locale;

    fhtCookie.setCookie("fht_locale", locale, 365);
  };

  render() {
    const { initDone } = this.state;
    const { locale } = this.props;

    const extraStyle =
      locale === "zh"
        ? {}
        : {
            //fontSize: 15,
          };

    return (
      initDone && (
        <div>
          <ConfigProvider locale={locale === "en" ? enUS : zhCN}>
            <BrowserRouter basename="/apps/wecom/">
              <Switch>
                <Content style={extraStyle} changeLocale={this.changeLocale} />
              </Switch>
            </BrowserRouter>
          </ConfigProvider>
        </div>
      )
    );
  }
}

const App = connect((state) => {
  return {
    locale: state.common.locale,
  };
})(_App);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
