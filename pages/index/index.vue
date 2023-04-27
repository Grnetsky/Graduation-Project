<template>
	<view class="content">
		<view class="img">
			<image width="375" src="/static/faxian.png"/>
		</view>
		<h1 class="title">你好！{{username}}</h1>
		<h2 class="title">请选择控制设备</h2>
		<uni-card v-for="item,index in carList" :key="index" @click="toControllPage(item.id,item.status)">
			{{item.id}}
			{{index}}
			<text>当前状态：<text>{{item.status?"可用":"不可用"}}</text></text>
		</uni-card>
	</view>
</template>

<script >
	export default {
		data() {
			return {
				username:'',	
				carList:[{id:1,name:"小车1",status:true},{id:2,name:"小车2",status:false},{id:3,name:"小车3",status:true}]
			}
		},
		onLoad(data) {
			this.getCarList()
			this.username = data.username
		},
		methods: {
			arrayBufferToBase64(buffer){
				var binary = '';
				var bytes = new Uint8Array(buffer);
				var len = bytes.byteLength;
				for(let i=0;i<len;i++){
					binary += String.fromCharCode(bytes[i]);
				}
				console.log(btoa(binary))
				return btoa(binary)
			},
			async getCarList(){
				console.log("进入列表");
				//do somethings
				this.carList = await this.Myrequest('carList/')
			},
			toControllPage(id,status){
				if(status){
					
					uni.navigateTo({
						url:`/pages/control/control?id=${id}`
					})
				}else {
					uni.showToast({title:"该设备不能使用",duration:2000,icon:"error"})
					return 
				}

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
	.img{
	margin-top: 200rpx;
	width: 100%;
	height: 60%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
