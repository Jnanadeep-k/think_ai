const executeCode = async ({
    language,
    code,
    stdin,
    callbackUrl
}) => {

    const languageMap = {
        python: 71,
        python3: 71,

        javascript: 63,
        js: 63,

        java: 62,

        c: 50,

        cpp: 54,
        "c++": 54,

        go: 60
    };


    const normalizedLanguage =
        language?.toLowerCase().trim();


    const languageId =
        languageMap[normalizedLanguage];


    if (!languageId) {
        throw new Error(
            `Unsupported language: ${language}`
        );
    }


    const judge0Url =
        process.env.JUDGE0_URL;


    if (!judge0Url) {
        throw new Error(
            "JUDGE0_URL is not configured"
        );
    }


    const body = {
        language_id: languageId,
        source_code: code,
        stdin: stdin || ""
    };


    /*
     * Add callback URL when provided.
     */
    if (callbackUrl) {
        body.callback_url = callbackUrl;
    }


    const response = await fetch(
        `${judge0Url}/submissions?base64_encoded=false&wait=false`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Judge0 submission failed: ${errorText}`
        );
    }


    const result =
        await response.json();


    return {
        success: true,

        data: {
            token: result.token || null,

            status:
                result.status || {
                    id: 1,
                    description: "In Queue"
                },

            stdout:
                result.stdout || null,

            stderr:
                result.stderr || null,

            compileOutput:
                result.compile_output || null,

            message:
                result.message || null,

            time:
                result.time || null,

            memory:
                result.memory || null
        }
    };
};


module.exports = {
    executeCode
};