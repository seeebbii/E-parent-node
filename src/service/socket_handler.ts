import express from 'express'
import { Server } from 'http';
import * as socketio from "socket.io";

export class SocketHandler {
    httpServer: Server
    static io: socketio.Server
    static currentSocket: socketio.Socket

    constructor(server: Server) {
        this.httpServer = server
        SocketHandler.io = new socketio.Server(this.httpServer, { allowEIO3: true } as socketio.ServerOptions);
    }

    public static handleConnection(): void{

        SocketHandler.io.on("connection", (socket) => {
            // Storing the connected socket id
            const currentSocketId = socket.id
            SocketHandler.currentSocket = socket;

            console.log("Socket Connected: ", socket.id);

            socket.emit('client_connected', `Your socket id is: ${socket.id}`)
        
            socket.on("disconnect", () => {

                SocketHandler.io.emit("client_disconnected", `Cient disconnected: ${currentSocketId}`);

                console.log("Socket Disconnected: ", socket.id);
            });    
        
        });

    }

    

}