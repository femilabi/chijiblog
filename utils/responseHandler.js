const { config } = require("../utils/mainUtils");

class ResHandler {

    resMethods = ["json", "jsonp", "send", "sendFile", "end", "redirect", "render"];
    resMethod = "render"; // json | jsonp | send | sendFile | end | redirect | render | download
    
    resTypes = ["info", "warning", "success", "error"];
    resType = null;

    resData = {};
    resObj = {};
    resMsg = null;
    resErrors = {};

    redirectURI = null;
    renderPage = null;

    constructor(req, res) {
        this.req = req;
        this.res = res;
        
        if (config("response_type") == "HTML" || !config("response_type")) {
            let page = "index";
            let paths = this.req.path.split("/");
            if (paths[0]) page = paths[0];
            this.setToHTML(page);
        } else if (config("response_type") == "JSON") {
            this.setToJSON();
        }
    }

    setType (type) {
        if (this.resTypes.includes(type)) this.resType = type;
        return this;
    }

    setMsg (msg, type = "info") {
        if (this.resTypes.includes(type)) this.resType = type;
        if (msg) this.resMsg = msg;
        return this;
    }

    setError (field, error) {
        this.resErrors[field] = error;
    }

    setMethod (method) {
        if (this.resMethods.includes(method)) this.resMethod = method;
        return this;
    }

    assignData (key, val = null) {
        if (key) this.resData[key] = val;
        return this;
    }

    setToHTML (page = null) {
        if (page) this.renderPage = page;
        this.setMethod("render");
        return this;
    }

    setToJSON () {
        this.setMethod("json");
        return this;
    }

    setToRedirect (url) {
        if (url) {
            this.setRedirectURI (url);
            this.setMethod("redirect");
        }
        return this;
    }

    setRedirectURI (url) {
        if (url) this.redirectURI = url;
        return this;
    }

    send () {
        let status = {};
        if (this.redirectURI) status["redirect"] = this.redirectURI;
        if (this.resType && this.resMsg) {
            status["type"] = this.resType;
            status["msg"] = this.resMsg;
        }

        let data = this.resData;

        this.resObj = {
            status,
            data
        }

        if (this.resMethod == "render") {
            this.res[this.resMethod](this.renderPage, this.resObj);
        } else if (this.resMethod == "json") {
            this.res[this.resMethod](this.resObj);
        } else if (this.resMethod == "redirect") {
            this.res[this.resMethod](this.redirectURI);
        } else {
            this.res[this.resMethod]({});
        }
    }
}

module.exports = ResHandler;