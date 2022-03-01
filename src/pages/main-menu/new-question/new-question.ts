import axios from 'axios';
import {Options, Vue} from 'vue-class-component';

@Options({})
export default class NewQuestion extends Vue {
    public onSubmit(): void {
        axios.get('/students');
    }
}
