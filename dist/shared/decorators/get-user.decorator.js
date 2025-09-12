"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserOrNull = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserOrNull = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user ?? null;
});
//# sourceMappingURL=get-user.decorator.js.map