export class CalendarDay {
    public date: Date;
    public title: string;
    public isPastDate: boolean;
    public isToday: boolean;
    public isLockDay: boolean
    public isSelectedDay: boolean;

    constructor(d: Date) {
        this.date = d;
        this.isPastDate = d.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
        this.isToday = d.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
        this.isLockDay = false;
        this.isSelectedDay = false;
    }
}
