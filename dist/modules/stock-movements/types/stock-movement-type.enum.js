"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementReason = exports.StockMovementType = void 0;
var StockMovementType;
(function (StockMovementType) {
    StockMovementType["ADD"] = "add";
    StockMovementType["REMOVE"] = "remove";
    StockMovementType["CORRECTION"] = "correction";
})(StockMovementType || (exports.StockMovementType = StockMovementType = {}));
var StockMovementReason;
(function (StockMovementReason) {
    StockMovementReason["SUPPLIER_DELIVERY"] = "supplier_delivery";
    StockMovementReason["INVENTORY_CORRECTION"] = "inventory_correction";
    StockMovementReason["CUSTOMER_RETURN"] = "customer_return";
    StockMovementReason["MANUAL_ADJUSTMENT"] = "manual_adjustment";
})(StockMovementReason || (exports.StockMovementReason = StockMovementReason = {}));
//# sourceMappingURL=stock-movement-type.enum.js.map