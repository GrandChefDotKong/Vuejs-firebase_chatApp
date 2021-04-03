<template>
    <div class="drawer-background" :class="{show: active}" @click="$emit('close-drawer')"></div>
    <div class="drawer" :class="{show: active}">
        <button class="close-drawer" @click="$emit('close-drawer')">X</button>
        <div class="view login">
            <form class="login-form" @submit.prevent="register">
                <div class="form-inner">
                    <h1>Register</h1>
                    <label for="username">E-mail</label>
                    <input type="mail" v-model="registerMail" placeholder="e-mail"><br>
                    <label for="username">Password</label>
                    <input type="password" v-model="registerPassword" placeholder="password"><br>
                    <input type="submit" value="Register">
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import db from '../data/db';

export default {
    props: ['active'],
    emits: ["close-drawer"],
    setup() {
        const registerMail = ref('');
        const registerPassword = ref('');

        const register = () => {
            if(registerMail.value === "" || registerMail.value === null || registerPassword.value === "" | registerPassword.value === null) {
                return;
            }

            db
            .auth()
            .createUserWithEmailAndPassword(registerMail.value, registerPassword.value)
            .then(() => {
                registerPassword.value = "";
                registerMail.value = "";
                alert('Your registration was successfull, please login now :)');
            }).catch(err => {
                console.log(err);
            });
        }

        return {
            registerMail, registerPassword, register
        }
    }
}
</script>

<style lang="scss">
    .drawer-background {
        width: 100%;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(124, 124, 124, 0.55);
        z-index: 10;
        display: none;
        transition: display 0.5s;

        &.show {
            display: block;
        }
    }

    .close-drawer {
        width: 20px;
        height: 35px;
    }

    .drawer {
        width: 95vw;
        height: 100vh;
        background-color: #42b983;
        position: fixed;
        top: 0;
        left: -105vw;
        padding: 15px;
        transition: left 0.5s;
        z-index: 11;
        overflow-y: scroll;

        &.show {
            left: 0;
        }
    }

    .drawer-close {
        display: flex;
        align-items: flex-start;
    }

    .product-details {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        p.description {
            padding: 20px;
            line-height: 1.5rem;
        }

    }

    @media (min-width: 500px) {
        .drawer {
            width: 450px;
        }
    }

</style>