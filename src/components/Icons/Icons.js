import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronDown,
    IconChevronUp,
    IconPlus,
    IconMinus,
    IconSearch,
    IconX,
    IconHome,
    IconShoppingCart,
    IconAdjustmentsHorizontal,
    IconCamera,
    IconMotorbike,
    IconMapPin,
    IconPhone,
    IconUser,
    IconBell,
    IconShoppingBag,
    IconLayout,
    IconList,
    IconMenu,
    IconTrash,
} from "@tabler/icons-react";

const ICONS = {
    chevronLeft: IconChevronLeft,
    chevronRight: IconChevronRight,
    chevronDown: IconChevronDown,
    chevronUp: IconChevronUp,
    plus: IconPlus,
    minus: IconMinus,
    search: IconSearch,
    close: IconX,
    home: IconHome,
    cart: IconShoppingCart,
    filters: IconAdjustmentsHorizontal,
    camera: IconCamera,
    delivery: IconMotorbike,
    mappin: IconMapPin,
    phone: IconPhone,
    user: IconUser,
    bell: IconBell,
    shopping: IconShoppingBag,
    layout: IconLayout,
    list: IconList,
    menu: IconMenu,
    trash: IconTrash
};

export default function Icons({name, strokeWidth = 2, color = "currentColor", size = 20, ...props}) {
    const IconComponent = ICONS[name];

    if (!IconComponent) {
        console.warn(`El icono "${name}" no está registrado.`);
        return null;
    }

    return (
        <IconComponent size={size} color={color} strokeWidth={strokeWidth} {...props} />
    );
}