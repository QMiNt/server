const dotenv = require("dotenv");
dotenv.config();
const myHeaders = new Headers();
myHeaders.append("MVApiKey",process.env.MVKEY );
myHeaders.append("MVSecretKey", process.env.MVSECRET);
myHeaders.append("GSTIN", process.env.GSTIN);
myHeaders.append("Content-Type", "application/json");

const gstUser = async (req, res) => {
    try {
        const { gstin, token } = req.body;
        // console.log(token)
        if (!gstin) {
            return res.status(400).json({ message: "GSTIN is required" });
        }

        const raw = JSON.stringify({
            "AppSCommonSearchTPItem": [{
                "GSTIN": gstin.trim()
            }]
        });

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SITE_KEY}&response=${token}`;
        const google_response = await fetch(url, { method: 'POST' }).then(response => response.json());
        console.log(google_response)
        if (google_response.success == false || google_response.score < 0.4) {
            return res.status(400).json({ message: "Invalid Captcha" });
        }

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const result = await fetch("https://www.ewaybills.com/MVEWBAuthenticate/MVAppSCommonSearchTP", requestOptions).then(response => response.text());
        const tem = JSON.parse(result);

        if (tem.Status !== "0") {
            return res.status(200).json(tem);
        } else {
            return res.status(400).json({ message: "Invalid GSTIN" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Some Error Occurred", error: err });
    }
};

const gstFiling = async (req, res) => {
    const { gstin, year } = req.body;
    if (!gstin) {
        return res.status(400).json({ message: "GSTIN is required" });
    }
    if (!year) {
        return res.status(400).json({ message: "Year is required" });
    }
    const raw = JSON.stringify({
        "AppCommonRetTrackItem": {
            "GSTIN": gstin.trim(),
            "FinYear": year
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://www.ewaybills.com/MVEWBAuthenticate/MVAppCommonRetTrackGSTIN", requestOptions);
        const result = await response.text();
        const data = JSON.parse(result).AppCommonRetTrackResponse.finlstAppTrackReturnResponse.EFiledlist;
        if (data) {
            const groupedData = data.reduce((acc, item) => {
                const { rtntype } = item;
                if (!acc[rtntype]) {
                    acc[rtntype] = [];
                }
                acc[rtntype].push(item);
                return acc;
            }, {});
            const sortedGroupedData = Object.entries(groupedData)
                .sort((a, b) => b[1].length - a[1].length)
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
            return res.status(200).json(sortedGroupedData);
        } else {
            return res.status(200).json({ message: "No Data Found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Some Error Occurred", error: error.message });
    }
};


module.exports = { gstFiling, gstUser };
