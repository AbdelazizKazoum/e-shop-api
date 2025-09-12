"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupplyOrderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_supply_order_dto_1 = require("./create-supply-order.dto");
class UpdateSupplyOrderDto extends (0, mapped_types_1.PartialType)(create_supply_order_dto_1.CreateSupplyOrderDto) {
}
exports.UpdateSupplyOrderDto = UpdateSupplyOrderDto;
//# sourceMappingURL=update-supply-order.dto.js.map