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
    props: {
        superValue: String,
    },
    data() {
        return {
            value: "",
            request: null,
        }
    },
    methods: {
        onSubmit() {
            let searchValue = this.value.trim();
            if (searchValue.length === 0) return;

            this.$emit('loading', searchValue);
            this.findShow(searchValue);
        },
        findShow(value) {
            let finalValue = encodeURIComponent(value);
            this.request = $.get(`/show/${finalValue}`);
            this.request.then((res) => {
                this.request = null; // Done;
                if (res.error) {
                    this.$emit('error', res.error);
                    return;
                }
                this.$emit('update', res);
            });
        },
    },
    watch: {
        superValue(newValue) {
            // console.log("Supervalue updated to " + newValue);
            if (newValue !== this.value) {
                if (this.request) {
                    console.log("Aborting call");
                    this.request.abort();
                    this.request = null;
                }
                // console.log("Resubmitting");
                this.value = newValue;
                this.onSubmit();
            }

        }
    }
}
</script>
