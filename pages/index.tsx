import { loader } from "@monaco-editor/react";
loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs" } });

import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Editor from "@monaco-editor/react";
import normalizeUrl from "normalize-url";
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";
import {
    CloseAction,
    ErrorAction,
    MessageTransports,
    MonacoLanguageClient,
} from "monaco-languageclient";

// import * as monaco from "monaco-editor";
// type Monaco = typeof monaco;

const ReconnectingWebSocket = require("reconnecting-websocket");

const Home: NextPage = () => {
    // install Monaco language client services
    const LanguageId = "python";
    const CODE = `
        #ff0000 (red)
        #00ff00 (green)
        #0000ff (blue)
        `;

    const onMount = (editor, monaco) => {
        // console.log("onMount", editor, monaco);
        // console.log("Mounted");
        function createUrl(hostname: string, port: number, path: string): string {
            // eslint-disable-next-line no-restricted-globals
            const protocol = location.protocol === "https:" ? "wss" : "ws";
            return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
        }
        function createWebsocket(socketUrl: string) {
            const socketOptions = {
                maxReconnectionDelay: 10000,
                minReconnectionDelay: 1000,
                reconnectionDelayGrowFactor: 1.3,
                connectionTimeout: 10000,
                maxRetries: Infinity,
                debug: false,
            };
            return new ReconnectingWebSocket.default(socketUrl, [], socketOptions);
        }
        // function createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
        //     return new MonacoLanguageClient({
        //         name: "Sample Language Client",
        //         clientOptions: {
        //             // use a language id as a document selector
        //             documentSelector: ["python"],
        //             // disable the default error handler
        //             errorHandler: {
        //                 error: () => ({ action: ErrorAction.Continue }),
        //                 closed: () => ({ action: CloseAction.DoNotRestart }),
        //             },
        //         },
        //         // create a language client connection from the JSON RPC connection on demand
        //         connectionProvider: {
        //             get: () => {
        //                 return Promise.resolve(transports);
        //             },
        //         },
        //     });
        // }
        // create the web socket
        const url = createUrl("localhost", 5000, "/");
        const webSocket = createWebsocket(url);
        // webSocket.onopen = () => {
        //     console.log("Opening Web socket connection");
        //     const socket = toSocket(webSocket);
        //     const reader = new WebSocketMessageReader(socket);
        //     const writer = new WebSocketMessageWriter(socket);
        //     const languageClient = createLanguageClient({
        //         reader,
        //         writer,
        //     });
        //     languageClient
        //         .start()
        //         .then(() => console.log("language client started"))
        //         .finally(() => console.log("language client done"));
        //     reader.onClose(() => languageClient.stop());
        // };
    };

    const beforeMount = (monaco) => {
        console.log("beforeMount", monaco);
        monaco.languages.register({
            id: LanguageId,
            extensions: [".py"],
            aliases: ["PYTHON", "python", "py"],
        });
    };

    return (
        <div className={styles.container}>
            <Editor
                height="90vh"
                defaultLanguage={LanguageId}
                defaultValue={CODE}
                onMount={onMount}
                beforeMount={beforeMount}
            />
        </div>
    );
};

export default Home;
