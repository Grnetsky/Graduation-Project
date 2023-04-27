export default async (myurl,httptype,userdata)=>{
	var BASEURL = "http://192.168.1.104:8008/"
	return new Promise((resolve,reject)=>{
		
		uni.showLoading({
			title:"加载中"
		})
		var token = ''
		uni.getStorage({
			key:'token',
			success(data){
				token = data.data || ''
			},
			fail() {
				console.log('没有jwt')
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
						
						// uni.hideToast()
						// uni.hideToast()
					},
					// timeout(){
					// 	uni.showToast({
							
					// 		title:"请求失败",
					// 		mask:true,
					// 	})
					// }
				})
			}
		})
	})
}