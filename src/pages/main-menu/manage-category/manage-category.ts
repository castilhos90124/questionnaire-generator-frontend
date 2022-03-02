
import {Vue} from 'vue-class-component';
import {useToast} from 'vue-toastification';

export default class ManageCategory extends Vue {
    public categories = [
        {
            name: 'Anderson',
            info: 'Castihos'
        },
        {
            name: 'Lorenzo',
            info: 'Dufech'
        }
    ];
    data(): {columns: string[]; categories: {name: string; info: string}[]} {
        return {
            columns: ['Nome', 'Descrição'],
            categories: this.categories
        };
    }
}
