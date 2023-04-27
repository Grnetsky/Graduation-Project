<template>
	<view class="login">
		<!-- <web-view :webview-styles="{process:'blue'}" src="/hybrid/html/lottie.html"></web-view> -->
		<view class="img">
			<image width="375" src="/static/welcome.png"/>
		</view>
		
		<h1 class="title">登陆</h1>
		<text class="tip">忘记密码？请联系管理员</text>
		
		<view class="forms">
			<view class="form username">
				<uni-icons type="person" size="20"></uni-icons>
				<input type="text" confirm-type="search" placeholder="请输入用户名" v-model="form.username">
			</view>
			<view class="form password">
				<uni-icons type="locked" size="20"></uni-icons>
				
				<input type="password" confirm-type="search" placeholder="请输入密码" v-model="form.password">
			</view>
			<view class="form button">
				<button  type="primary"  style="background-color: rgb(255, 190, 33);width: 100%;" @click="login">登录</button>
			</view>
			
		</view>
		<view class="footer">
			<text>@Designed By 郑州轻工业大学 | 蔡豪</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form:{username:'',password:''}
			}
		},
		
		methods: {
			toGLY(){
				uni.navigateTo({
					url:'/pages/gly/gly'
				})
			},
			
			async login(){
				if(this.form.username === '' || this.form.password === ''){
						uni.showToast({
							title:"请输入账号和密码",
							position:"bottom"
						});
						return
				} 
				// this.Myrequest('')
				uni.navigateTo({
					url:`/pages/index/index?username=${this.form.username}`,
					animationType:'fade-in',
					animationDuration:800
				})
			}
		}
	}
</script>

<style scoped>

.title {
	color:  rgb(224, 150, 0);
	text-indent: 8;
	font-weight: 800;
	margin-left: 40rpx;
	margin-top: 50rpx;
}

.form{
	width: 90%;
	height: 100rpx;
	border-radius: 35rpx;
	background-color: rgb(241, 243, 255);
	margin-top: 40rpx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.uni-icons{
	width: 15%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.forms {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 40rpx;
}

.tip{
	float: right;
	margin-right: 40rpx;
	color: blue;
	font-size: 26rpx;
	text-decoration: none;
}
.button{
	margin-top: 80rpx;
}
.img{
	margin-top: 200rpx;
	width: 100%;
	height: 60%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.footer{
	margin-top:200rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #4e4e4e;
	font-size: 28rpx;
}
</style>
