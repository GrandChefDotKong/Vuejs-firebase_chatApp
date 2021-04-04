<template>
  <Drawer :active="showDrawer" v-on:close-drawer="()=>{ showDrawer = false }"></Drawer>
  <div class="view login" v-if="state.username === '' || state.username === null">
	<h1 class="main-title">Welcome to Vue Chat</h1>
	<div class="logo-container">
		<img src="./assets/logo.png" alt="logo">
	</div>
    <form class="login-form" @submit.prevent="login">
      <div class="form-inner">
        <h1>Login</h1>
        <label for="username">E-mail</label>
        <input type="mail" v-model="inputUsermail" placeholder="e-mail">
        <label for="username">Password</label>
        <input type="password" v-model="inputUserpassword" placeholder="password">
        <input type="submit" value="Login">
        <p>Need an account ? <span class="register-link" @click="()=>{ showDrawer = true }">Register here</span></p>
      </div>
    </form>
	<footer class="footer">powered by Vue.js and Firebase</footer>
  </div>
  <div class="view chat" v-else>
    <header>
      <button @click="logout" class="logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    <section class="chat-box">
      <div 
        :class="(message.usermail == state.usermail ? 'message current-user' : 'message')" 
        v-for="message in state.messages" 
        :key="message.id"
      >
      <div class="message-inner">
        <div class="username">{{ message.usermail.split('@')[0] }}</div>
        <div class="content">{{ message.content }}</div>
      </div>
      </div>
    </section>
    <footer>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="inputMessage" placeholder="write a message">
        <input type="submit" value="Send">
      </form>
    </footer>
  </div>
</template>

<script>
import db from './data/db';
import { reactive, onMounted, ref } from 'vue';
import Drawer from './components/Drawer.vue';

export default {
  name: 'App',
  components: { Drawer },
  setup() {
    const inputUsermail = ref("");
    const inputUserpassword = ref("");

    let showDrawer = ref(false);

    const inputMessage = ref("");
    const state = reactive({
      username: "",
		usermail: "",
      messages: []
    })

    const login = () => {
      db
	.auth().signInWithEmailAndPassword(inputUsermail.value, inputUserpassword.value)
	.then(data => {
		state.username = data.user.email.split('@')[0];
		state.usermail = data.user.email;
	})
	.catch(err => alert(err.message));
    }

    const logout = () => {
      db.auth().signOut();
      state.username = "";
    }

    const sendMessage = () => {
      const messageRef = db.database().ref("messages");

      if(inputMessage.value === "" | inputMessage.value === null) {
        return;
      }

      const message = {
        usermail: state.usermail,
        content: inputMessage.value
      }

      messageRef.push(message);
      inputMessage.value = "";
    }

    onMounted(() => {
      const messageRef = db.database().ref("messages");

      messageRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];

        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            usermail: data[key].usermail,
            content: data[key].content,
          })
        })

        state.messages = messages;
      })
    })

    return { inputUsermail, inputUserpassword, state, login, logout, inputMessage, sendMessage, showDrawer }
  }
}
</script>

<style lang="scss">
* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.main-title {
	background-color: #FFF;
	text-align: center;
	color: #42b983;
	padding: 10px;
	border-radius: 8px;
	margin-bottom: 5vh;
	font-weight: 700;
}
.logo-container {
	background-color: #FFF;
	border-radius: 100px;
	display: grid;
	place-items: center;
	height: 80px;
	width: 80px;
	margin-bottom: 4vh;

	img {
		height: 60px;
		transform: translateY(5px);
	}
}
.footer {
	color: #FFF;
	transform: translateY(8vh);
}
.view {
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 100vh;
	background-color: #42b983;
	
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
			padding-top: 0px;
			
			.form-inner {
				display: block;
				background-color: #FFF;
				padding: 40px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
				h1 {
					color: #AAA;
					font-size: 28px;
					margin-bottom: 30px;
				}
				label {
					display: block;
					margin-bottom: 5px;
					color: #AAA;
					font-size: 16px;
					transition: 0.4s;
				}
				input[type="password"], input[type="mail"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px;
					margin-bottom: 15px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				input[type="submit"], button {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: #42b983;
					border-radius: 8px;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
				p {
					color: #AAA;
					margin-top: 20px;

					span {
						background-color: #42b983;
						color: #FFF;
						padding: 8px;
						border-radius: 6px;
						font-size: 14px;
						margin-left: 5px;
						font-weight: 700;
					}
				}
				&:focus-within {
					label {
						color: #42b983;
					}
					input[type="text"] {
						background-color: #FFF;
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
						&::placeholder {
							color: #666;
						}
					}
				}
			}
		}
	}
	&.chat {
		flex-direction: column;
		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;
			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
				
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}
			h1 {
				color: #FFF;
			}
		}
		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: #FFF;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;
			.message {
				display: flex;
				margin-bottom: 15px;
				
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding-left: 15px;
						padding-right: 15px;
					}
					.content {
						display: inline-block;
						padding: 10px 20px;
						background-color: #F3F3F3;
						border-radius: 999px;
						color: #333;
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}
				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;
					.message-inner {
						max-width: 75%;
						.content {
							color: #FFF;
							font-weight: 600;
							background-color: #42b983;
						}
					}
				}
			}
		}
		footer {
			position: sticky;
			bottom: 0px;
			background-color: #FFF;
			padding: 30px;
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			form {
				display: flex;
				input[type="text"] {
					flex: 1 1 100%;
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px 0px 0px 8px;
					
					color: #333;
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #F3F3F3;
					transition: 0.4s;
					&::placeholder {
						color: #888;
						transition: 0.4s;
					}
				}
				
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					padding: 10px 15px;
					border-radius: 0px 8px 8px 0px;
					background-color: #42b983;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}
</style>
