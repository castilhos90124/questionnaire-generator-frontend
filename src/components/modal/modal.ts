import {Options, Vue} from 'vue-class-component';

@Options({
    name: 'app-modal',
    props: {
        modalActive: Boolean
    }
})
export default class Modal extends Vue {
    public close() {
        this.$emit('close');
    }
}
