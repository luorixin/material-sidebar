/* eslint-disable */
/*
 * @Author: Zheng Kun
 * @Date: 2019-06-18 14:21:41
 * @LastEditors  : Zheng Kun
 * @LastEditTime : 2020-01-02 10:55:56
 * @Description:
 */

class fhtCookie {
  get = (a) => {
    for (
      var a = a + "=", b = document.cookie.split(";"), c = 0;
      c < b.length;
      c++
    ) {
      for (var e = b[c]; " " == e.charAt(0); ) e = e.substring(1, e.length);
      if (0 == e.indexOf(a))
        return decodeURIComponent(e.substring(a.length, e.length));
    }

    return null;
  };

  set = (a, b, c, e, f) => {
    var d;
    var k = "",
      j = "",
      i = "";
    e &&
      ((d = (k = (k = document.location.hostname.match(
        /[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i
      ))
        ? k[0]
        : "")
        ? "; domain=." + k
        : ""),
      (k = d));
    c &&
      ((j = new Date()),
      j.setTime(j.getTime() + 864e5 * c),
      (j = "; expires=" + j.toGMTString()));
    f && (i = "; secure");
    document.cookie = a + "=" + encodeURIComponent(b) + j + "; path=/" + k + i;
  };

  remove = (a, b) => {
    this.set(a, "", -1, b);
  };

  getCookie = (a, useLocalStorage) => {
    var cookie = this.get(a);

    if (!cookie || useLocalStorage) {
      if (window.localStorage) {
        var b = localStorage.getItem(a);
        b && this.set(a, b, 365);
        return b;
      } else {
        return null;
      }
    } else {
      return cookie;
    }
  };

  setCookie = (a, b, c) => {
    this.set(a, b, c);
    window.localStorage && localStorage.setItem(a, b);
  };

  removeCookie = (a) => {
    this.remove(a);
    window.localStorage && localStorage.removeItem(a);
  };

  getBrowserLocale = () => {
    const locale = navigator.language.split("_")[0];

    if (locale != "zh" && locale != "en") {
      return "zh";
    }

    return "zh"; //locale;
  };
}

export default new fhtCookie();
