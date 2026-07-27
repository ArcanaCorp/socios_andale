export const formatMoney = (value) => {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
};

export const toNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
};

export const CURRENCY_OPTIONS = [
    {
        value: "PEN",
        label: "Soles peruanos - PEN"
    },
    {
        value: "USD",
        label: "Dólares - USD"
    }
];

export const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("es-PE");
}