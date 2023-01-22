import express from 'express'
import { Server } from 'http';
import * as socketio from "socket.io";

export class SocketHandler {
    httpServer: Server
    static io: socketio.Server
    static currentSocket: Array<socketio.Socket>

    constructor(server: Server) {
        this.httpServer = server
        SocketHandler.io = new socketio.Server(this.httpServer, { allowEIO3: true } as socketio.ServerOptions);
        SocketHandler.currentSocket = [];
    }

    public static handleConnection(): void{

        SocketHandler.io.on("connection", (socket) => {
            
            // Storing the connected socket id
            const currentSocketId = socket.id
            SocketHandler.currentSocket.push(socket);
            // console.log(SocketHandler.currentSocket.length)

            // console.log("Socket Connected: ", socket.id);
            socket.emit('client_connected', socket.id)
            socket.on("disconnect", () => {

                let index = SocketHandler.currentSocket.findIndex(e => e.id === currentSocketId)
                SocketHandler.currentSocket.splice(index, 1);

                // console.log(SocketHandler.currentSocket)
                // console.log(SocketHandler.currentSocket.length)
                
                SocketHandler.io.emit("client_disconnected", `Cient disconnected: ${currentSocketId}`);

                console.log("Socket Disconnected: ", socket.id);
            });    
        
        });

    }

    

}