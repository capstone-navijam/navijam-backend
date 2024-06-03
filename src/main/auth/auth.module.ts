import {
    Module,
} from "@nestjs/common";
import {
    JwtModule,
} from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            signOptions: {
                expiresIn: "1h",
            },

        }),
    ],
})

export class AuthModule {
}