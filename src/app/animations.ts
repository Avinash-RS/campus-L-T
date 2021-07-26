import { trigger, transition, query, style, animate, group } from '@angular/animations';


export const slide = [
    trigger('animSlider', [
        transition(':increment', [
            query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
            group([
                query(':enter', [style({ transform: 'translateX(100%)' }), animate('0.50s ease-out', style({ transform: 'translateX(0%)' }))], {
                    optional: true,
                }),
                query(':leave', [style({ transform: 'translateX(0%)' }), animate('0.50s ease-out', style({ transform: 'translateX(-100%)' }))], {
                    optional: true,
                }),
            ]),
        ]),
        transition(':decrement', [
            query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
            group([
                query(':enter', [style({ transform: 'translateX(-100%)' }), animate('0.50s ease-out', style({ transform: 'translateX(0%)' }))], {
                    optional: true,
                }),
                query(':leave', [style({ transform: 'translateX(0%)' }), animate('0.50s ease-out', style({ transform: 'translateX(100%)' }))], {
                    optional: true,
                }),
            ]),
        ]),
    ]),
]


export const imgslide = [
    trigger('animSlider', [
        transition(':increment', [
            query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
            group([
                query(':enter', [style({ transform: 'translateX(100%)' }), animate('1.22s ease-in', style({ transform: 'translateX(0%)' }))], {
                    optional: true,
                }),
                query(':leave', [style({ transform: 'translateX(0%)' }), animate('1.22s ease-in', style({ transform: 'translateX(-100%)' }))], {
                    optional: true,
                }),
            ]),
        ]),
        transition(':decrement', [
            query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
            group([
                query(':enter', [style({ transform: 'translateX(-100%)' }), animate('1.22s ease-out', style({ transform: 'translateX(0%)' }))], {
                    optional: true,
                }),
                query(':leave', [style({ transform: 'translateX(0%)' }), animate('1.22s ease-out', style({ transform: 'translateX(100%)' }))], {
                    optional: true,
                }),
            ]),
        ]),
    ]),
]