import {BASEURL} from './baseip.js'
export default async (myurl,httptype,userdata)=>{
	return new Promise((resolve,reject)=>{
		console.log("发送请求",BASEURL)
		uni.showLoading({
			title:"加载中"
		})
		var token = ''
		uni.getStorage({
			key:'token',
			success(data){
				token = data.data || ''
			},
			complete() {
				uni.request({
					url: BASEURL+ myurl,
					data: userdata ||  "",
					method: httptype || 'GET',
					timeout:3000,
					dataType: 'json',
					header:{
						'Authorization':'JWT '+token,
						// 'X-CSRFToken':uni.getStorage({
						// 	key:'csrftoken'
						// })
					},
					success(res){
						resolve(res.data);
					},
					fail(err){
						uni.hideLoading()
						uni.showToast({
							title:"请检查网络状态",
							icon:"error"
							
						})
					},
					complete(){
						uni.hideLoading()
						uni.stopPullDownRefresh();
						
						
					},
				})
			}
		})
	})
}