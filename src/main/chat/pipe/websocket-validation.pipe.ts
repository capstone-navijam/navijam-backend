import {
    ValidationPipe,
} from "@nestjs/common";
import {
    WsException,
} from "@nestjs/websockets";

export class WebSocketValidationPipe extends ValidationPipe {
    createExceptionFactory() {
        return (validationErrors = []) => {
            if (this.isDetailedOutputDisabled) {
                return new WsException("Bad request");
            }
            const errors = this.flattenValidationErrors(validationErrors);

            return new WsException(errors);
        };
    }
}