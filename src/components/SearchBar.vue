<template>
    <form @submit.prevent="onSubmit" class="form-inline">
        <div class="form-group">
            <input class="form-control" type="search" name="searcho" placeholder="Type here to search" v-model="value" />
            <button type="submit" class="btn btn-primary">Search</button>
        </div>
    </form>
</template>
<script>
export default {
    data() {
        return {
            value: ""
        }
    },
    methods: {
        onSubmit() {
            this.$emit('loading');
            let searchValue = this.value;
            console.log(searchValue);

            this.findShow(searchValue);
        },
        findShow(value) {
            let finalValue = encodeURIComponent(value);
            $.get(`/show/${finalValue}`).then((res) => {
                if (res.error) {
                    alert(res.error);
                    return;
                }
                this.$emit('update', res);
            });
        },
    },
}
</script>
