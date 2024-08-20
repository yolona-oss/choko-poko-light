//const allowlist = ["http://localhost:3000", "http://localhost:8000"];
export const corsOptions = {
    origin: function(_: any, __: any) {
        //if (allowlist.includes(origin)) {
        //    callback(null, true);
        //} else {
        //    callback(new Error("Not allowed by CORS"));
        //}
    },
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
};
