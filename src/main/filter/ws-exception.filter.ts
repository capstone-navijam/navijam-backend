import {
    ArgumentsHost, Catch,
} from "@nestjs/common";
import {
    BaseWsExceptionFilter, WsException,
} from "@nestjs/websockets";

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter<WsException> {
    catch(exception: WsException, host: ArgumentsHost) {
        super.catch(exception, host);

        const socket = host.switchToWs().getClient();
        socket.emit("error", {
            message: exception.message,
        });
    }
}