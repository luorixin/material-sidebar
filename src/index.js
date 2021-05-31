import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import intl from "react-intl-universal";
import { LocaleProvider } from "antd-mobile";
import moment from "moment";
import "moment/locale/zh-cn";
import enUS from 'antd-mobile/lib/locale-provider/en_US';

import fhtCookie from "./utils/cookie";
import store from "./store";

import reportWebVitals from "./reportWebVitals";

import MaterialManage from "./app/material/App";

const locales = {
  en: require("./static/i18n/en_US.js").default,
  zh: require("./static/i18n/zh_CN.js").default,
};

class Content extends Component {
  render() {
    return (
      <Fragment>
        <MaterialManage />
        <Route path="/" exact render={() => <Redirect to="/material-manage" />} />
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

    intl.init({
        currentLocale: locale,
        locales,
      }).then(() => {
        this.setState({
          initDone: true
        })
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
      !!initDone && (
        <div>
          <LocaleProvider locale={locale === "en" ? enUS : undefined}>
            <BrowserRouter basename="/sidebar/">
              <Switch>
                <Content style={extraStyle} changeLocale={this.changeLocale} />
              </Switch>
            </BrowserRouter>
          </LocaleProvider>
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
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
