import { formatMoney } from "@/helpers/formatted.helper";
import { formatDate, getStatusClass, ORDER_TYPE_LABELS, PAYMENT_LABELS, STATUS_LABELS } from "@/helpers/orders.helper";
import { useState } from "react";
import Icons from "../Icons/Icons";

export default function CardOrder({ order, updating, onUpdateStatus }) {
    
    const [openDetails, setOpenDetails] = useState(false);
    const items = order.foodie_order_items || [];

    const canAccept = order.status === "pending";
    const canPrepare = order.status === "accepted";
    const canComplete = order.status === "preparing" || order.status === "accepted";
    const canReject = order.status === "pending";

    const hasPaymentVoucher = !!order.payment_attachment_url;

    return (
        <li className="w-full bg-white border-thin border-surface rounded-md p-md flex flex-col gap-sm">
            
            <div className="w-full flex items-start justify-between gap-md">
                
                <div className="flex flex-col gap-2xs">
                    <h3 className="text-md text-semibold">{order.order_code}</h3>
                    <p className="text-xs text-muted">{formatDate(order.created_at)}</p>
                </div>

                <span className={`text-xs text-semibold rounded-full px-sm py-2xs ${getStatusClass(order.status)}`}>{STATUS_LABELS[order.status] || order.status}</span>

            </div>

            <div className="w-full grid gap-sm grid-cols-2">

                <div className="bg-surface rounded-md p-sm">
                    <p className="text-2xs text-muted">Total</p>
                    <p className="text-sm text-semibold">S/ {formatMoney(order.total)}</p>
                </div>

                <div className="bg-surface rounded-md p-sm">
                    <p className="text-2xs text-muted">Pago</p>
                    <p className="text-sm text-semibold">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</p>
                </div>

            </div>

            <div className="w-full bg-surface rounded-md p-sm flex items-center justify-between gap-sm">
                <div className="w-full flex flex-col gap-2xs">
                    <p className="text-xs text-semibold">Voucher de pago</p>
                    <p className="text-2xs text-muted">{hasPaymentVoucher ? "El cliente adjuntó una captura del pago." : "Este pedido no tiene voucher adjunto."}</p>
                </div>

                {hasPaymentVoucher ? (
                    <a href={order.payment_attachment_url} target="_blank" rel="noreferrer" className="h rounded-full bg-primary text-white center text-xs text-semibold px-md text-nowrap" style={{"--h": "32px", minWidth: "90px"}}>Ver voucher</a>
                ) : (
                    <span className="text-xs text-muted">Sin voucher</span>
                )}
            </div>

            <button type="button" className="w-full h rounded-md bg-surface text-sm text-semibold flex items-center justify-between px-md" style={{ "--h": "40px" }} onClick={() => setOpenDetails((prev) => !prev)}>
                <span>{openDetails ? "Ocultar detalles" : "Ver detalles del pedido"}</span>
                <span className="text-lg">{openDetails ? <Icons name={'chevronUp'} /> : <Icons name={'chevronDown'} />}</span>
            </button>

            {openDetails && (
                <>
                    <div className="w-full flex flex-col gap-xs">
                        
                        <p className="text-xs text-muted">Tipo: <b>{ORDER_TYPE_LABELS[order.order_type] || order.order_type}</b></p>

                        {order.customer_phone && (
                            <p className="text-xs text-muted">WhatsApp: <b>{order.customer_phone}</b></p>
                        )}

                        {order.delivery_address && (
                            <p className="text-xs text-muted">Dirección: <b>{order.delivery_address}</b></p>
                        )}

                        {order.delivery_reference && (
                            <p className="text-xs text-muted">Referencia: <b>{order.delivery_reference}</b></p>
                        )}

                        {order.customer_notes && (
                            <p className="text-xs text-muted">Nota: <b>{order.customer_notes}</b></p>
                        )}

                    </div>

                    <div className="w-full flex flex-col gap-xs">
                        
                        <h4 className="text-sm text-semibold">Productos</h4>

                        <ul className="w-full flex flex-col gap-xs">
                            {items.map((item) => (
                                <li key={item.id} className="w-full flex items-center justify-between gap-sm">
                                    <div className="w-full">
                                        <p className="text-xs text-semibold">{item.quantity} x {item.product_name}</p>
                                        <p className="text-2xs text-muted">S/ {formatMoney(item.unit_price)} c/u</p>
                                    </div>
                                    <p className="text-xs text-semibold">S/ {formatMoney(item.subtotal)}</p>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <div className="w-full border-top-thin border-surface pt-sm flex flex-col gap-xs">
                        
                        <div className="w-full flex items-center justify-between">
                            <p className="text-xs text-muted">Subtotal</p>
                            <p className="text-xs text-semibold">S/ {formatMoney(order.subtotal)}</p>
                        </div>

                        <div className="w-full flex items-center justify-between">
                            <p className="text-xs text-muted">Delivery</p>
                            <p className="text-xs text-semibold">S/ {formatMoney(order.delivery_fee)}</p>
                        </div>

                        <div className="w-full flex items-center justify-between">
                            <p className="text-sm text-semibold">Total</p>
                            <p className="text-sm text-semibold">S/ {formatMoney(order.total)}</p>
                        </div>

                    </div>
                </>
            )}

            {(canAccept || canPrepare || canComplete || canReject) && (
                <div className="w-full flex gap-xs pt-xs">
                    {canAccept && (
                        <button type="button" className="w-full h rounded-full bg-primary text-white text-xs text-semibold" style={{ "--h": "36px" }} disabled={updating} onClick={() => onUpdateStatus(order.id, "accepted")}>
                            Aceptar
                        </button>
                    )}

                    {canPrepare && (
                        <button type="button" className="w-full h rounded-full bg-primary text-white text-xs text-semibold" style={{ "--h": "36px" }} disabled={updating} onClick={() => onUpdateStatus(order.id, "preparing")}>
                            Preparar
                        </button>
                    )}

                    {canComplete && (
                        <button type="button" className="w-full h rounded-full bg-success text-white text-xs text-semibold" style={{ "--h": "36px" }} disabled={updating} onClick={() => onUpdateStatus(order.id, "completed")}>
                            Completar
                        </button>
                    )}

                    {canReject && (
                        <button type="button" className="w-full h rounded-full bg-surface text-danger text-xs text-semibold" style={{ "--h": "36px" }} disabled={updating} onClick={() => onUpdateStatus(order.id, "rejected")}>
                            Rechazar
                        </button>
                    )}
                </div>
            )}

        </li>
    );
}