"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const order_repository_1 = require("./repositories/order.repository");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const address_entity_1 = require("../users/entities/address.entity");
const order_entity_1 = require("./entities/order.entity");
const variant_entity_1 = require("../products/entities/variant.entity");
const orderItem_entity_1 = require("./entities/orderItem.entity");
const payment_entity_1 = require("./entities/payment.entity");
const stock_service_1 = require("../stock/stock.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(orderRepository, dataSource, stockService) {
        this.orderRepository = orderRepository;
        this.dataSource = dataSource;
        this.stockService = stockService;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async createOrder(dto, userId) {
        return await this.dataSource.transaction(async (manager) => {
            const user = userId
                ? await manager.findOne(user_entity_1.User, { where: { id: userId } })
                : null;
            const address = manager.create(address_entity_1.Address, {
                firstName: dto.shippingAddress.firstName,
                lastName: dto.shippingAddress.lastName,
                address: dto.shippingAddress.address,
                city: dto.shippingAddress.city,
                country: dto.shippingAddress.country,
                zipCode: dto.shippingAddress.zipCode,
                addressType: dto.shippingAddress.addressType,
                phone: dto.contactInfo.phone,
                email: dto.contactInfo.email,
                user,
            });
            await manager.save(address);
            const order = manager.create(order_entity_1.Order, {
                user,
                total: dto.totalAmount,
                status: order_entity_1.OrderStatus.PENDING,
                paymentStatus: order_entity_1.PaymentStatus.UNPAID,
                shippingAddress: address,
            });
            await manager.save(order);
            for (const item of dto.items) {
                const variant = await manager.findOne(variant_entity_1.Variant, {
                    where: { id: item.variantId },
                    relations: ['stock', 'product'],
                });
                if (!variant) {
                    throw new common_1.NotFoundException(`Product variant with ID "${item.variantId}" not found.`);
                }
                if (!variant.stock) {
                    throw new common_1.InternalServerErrorException(`Stock empty for product: "${variant.product.name}".`);
                }
                if (variant.stock.quantity < item.quantity) {
                    throw new common_1.BadRequestException(`Out of stock for "${variant.product.name}" (Size: ${variant.size}, Color: ${variant.color}). Only ${variant.stock.quantity} left.`);
                }
                const orderItem = manager.create(orderItem_entity_1.OrderItem, {
                    order,
                    variant,
                    prix_unitaire: item.price,
                    quantite: item.quantity,
                    sous_total: item.price * item.quantity,
                });
                await manager.save(orderItem);
            }
            const payment = manager.create(payment_entity_1.Payment, {
                order,
                methode: dto.paymentInfo.method,
                status: 'pending',
                date: new Date(),
            });
            await manager.save(payment);
            return order;
        });
    }
    async getAllOrdersFilteredAndPaginated(page = 1, limit = 10, filters) {
        try {
            const query = this.orderRepository['orderRepository']
                .createQueryBuilder('order')
                .leftJoinAndSelect('order.shippingAddress', 'shippingAddress')
                .leftJoin('order.user', 'user')
                .leftJoinAndSelect('order.details', 'details')
                .leftJoinAndSelect('details.variant', 'variant')
                .leftJoinAndSelect('variant.product', 'product')
                .select([
                'order.id',
                'order.createdAt',
                'order.status',
                'order.paymentStatus',
                'order.total',
                'shippingAddress.firstName',
                'shippingAddress.lastName',
                'shippingAddress.email',
                'shippingAddress.address',
                'shippingAddress.city',
                'shippingAddress.phone',
                'shippingAddress.zipCode',
                'shippingAddress.country',
                'shippingAddress.addressType',
                'user.id',
                'details.id',
                'details.quantite',
                'details.prix_unitaire',
                'variant.id',
                'variant.size',
                'variant.color',
                'product.name',
                'product.image',
            ]);
            if (filters.customer) {
                const customerQuery = `%${filters.customer.toLowerCase()}%`;
                query.andWhere('(LOWER(shippingAddress.firstName) LIKE :customer OR LOWER(shippingAddress.lastName) LIKE :customer OR LOWER(shippingAddress.email) LIKE :customer)', { customer: customerQuery });
            }
            if (filters.status) {
                query.andWhere('order.status = :status', { status: filters.status });
            }
            if (filters.paymentStatus) {
                query.andWhere('order.paymentStatus = :paymentStatus', {
                    paymentStatus: filters.paymentStatus,
                });
            }
            if (filters.minTotal) {
                query.andWhere('order.total >= :minTotal', {
                    minTotal: filters.minTotal,
                });
            }
            if (filters.maxTotal) {
                query.andWhere('order.total <= :maxTotal', {
                    maxTotal: filters.maxTotal,
                });
            }
            if (filters.startDate) {
                query.andWhere('order.createdAt >= :startDate', {
                    startDate: filters.startDate,
                });
            }
            if (filters.endDate) {
                query.andWhere('order.createdAt <= :endDate', {
                    endDate: filters.endDate,
                });
            }
            query
                .orderBy('order.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit);
            const [orders, total] = await query.getManyAndCount();
            return {
                data: orders,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            this.logger.error('Failed to fetch orders with filters', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch orders');
        }
    }
    async updateOrder(orderId, updates) {
        return this.dataSource.transaction(async (manager) => {
            try {
                const order = await manager.findOne(order_entity_1.Order, {
                    where: { id: orderId },
                    relations: ['details', 'details.variant'],
                });
                if (!order) {
                    throw new common_1.NotFoundException(`Order with id ${orderId} not found`);
                }
                const originalStatus = order.status;
                if (updates.status) {
                    order.status = updates.status;
                }
                if (updates.paymentStatus) {
                    order.paymentStatus = updates.paymentStatus;
                }
                if (updates.status === order_entity_1.OrderStatus.DELIVERED &&
                    originalStatus !== order_entity_1.OrderStatus.DELIVERED) {
                    this.logger.log(`Order ${orderId} status changed to DELIVERED. Updating stock...`);
                    for (const item of order.details) {
                        if (!item.variant || !item.variant.id) {
                            throw new common_1.InternalServerErrorException(`Order item ${item.id} is missing variant information.`);
                        }
                        await this.stockService.decreaseStockForVariant(item.variant.id, item.quantite, manager);
                    }
                }
                return await manager.save(order);
            }
            catch (error) {
                this.logger.error(`Failed to update order with id ${orderId}`, error.stack);
                throw error;
            }
        });
    }
    findOne(id) {
        return `This action returns a #${id} order`;
    }
    remove(id) {
        return `This action removes a #${id} order`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository,
        typeorm_1.DataSource,
        stock_service_1.StockService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map