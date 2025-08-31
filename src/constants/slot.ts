export type BP = 'mobile' | 'tablet' | 'desktop';

export type Slot = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    cornerRadius?: number | number[];
    scale?: number;
};

export const BASE_BY_BP = { mobile: 320, tablet: 600, desktop: 800 } as const;

export const SLOT_VECTORS: Partial<Record<BP, Slot[]>> = {
    mobile: [
        {
            x: 35,
            y: 134,
            width: 112,
            height: 112,
            rotation: 4.2,
            cornerRadius: 0,
            scale: 0.68,
        },
        {
            x: 163,
            y: 60,
            width: 114,
            height: 114,
            rotation: -5.8,
            cornerRadius: 0,
            scale: 0.68,
        },
    ],
    // tablet: [
    //     {
    //         x: 66,
    //         y: 252,
    //         width: 207,
    //         height: 207,
    //         rotation: 4.2,
    //         cornerRadius: 0,
    //         scale: 0.68,
    //     },
    //     {
    //         x: 305.5,
    //         y: 112,
    //         width: 213,
    //         height: 213,
    //         rotation: -5.8,
    //         cornerRadius: 0,
    //         scale: 0.68,
    //     },
    // ],

    // ❖ Ví dụ: nếu anh có vector riêng cho tablet & desktop, điền vào đây:
    // tablet: [ ... ],
    // desktop: [ ... ],
};

const scaleSlots = (src: Slot[], ratio: number): Slot[] =>
    src.map(s => ({
        ...s,
        x: s.x * ratio,
        y: s.y * ratio,
        width: s.width * ratio,
        height: s.height * ratio,
    }));

export function getSlotsForBP(bp: BP): Slot[] {
    const explicit = SLOT_VECTORS[bp];
    if (explicit) return explicit;

    const mobile = SLOT_VECTORS.mobile ?? [];
    const ratio = BASE_BY_BP[bp] / BASE_BY_BP.mobile;
    return scaleSlots(mobile, ratio);
}

export const SLOT_SHARE = {
    x: 400,
    y: 660,
    w: 498,
    h: 498,
    rotation: -4,
};
