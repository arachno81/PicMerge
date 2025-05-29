<template>
	<div>
		<div class="p-6">
			<h2 class="text-2xl font-bold mb-4">画像インポート</h2>
			<!-- Drag & Drop -->
			<div
				@dragover.prevent
				@drop.prevent="handleDrop"
				class="border-2 border-dashed border-gray-400 rounded p-10 text-center text-gray-50"
				>
				ここに画像
			</div>
				<!-- ファイル選択 -->
			<input type="file" multiple @change="handleFileChange" accept="image/*" />

			<div class="mt-6 space-x-4">
				<label class="inline-block">
					出力幅:
					<input type="number" v-model.number="outputWidth" class="border px-2 py-1 w-24" />
				</label>
				<label class="inline-block">
					出力高さ:
					<input type="number" v-model.number="outputHeight" class="border px-2 py-1 w-24" />
				</label>
			</div>

			<!-- プレビュー表示 -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
				<div
					v-for="(img, index) in previews"
					:key="index"
					class="border rounded overflow-hidden cursor-pointer"
					:class="{ 'ring-4 ring-blue-500' : selectedImages.includes(img) }"
					@click="toggleSelection(img)"
					>
					<img :src="img" class="w-full object-cover" />
				</div>
			</div>
			<!-- 結合結果 -->
			<h3 class="mt-6 text-xl font-bold">4枚の画像を結合した結果</h3>
			<div v-if="mergedImage" class="mt-4">
				<img :src="mergedImage" class="border" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'

const previews = ref([])
const mergedImage = ref(null)

const selectedImages = ref([])

const outputWidth = ref(1200)
const outputHeight = ref(800)

function handleFileChange(e){
	const files = e.target.files
	previewFiles(files)
}

function handleDrop(e){
	const files = e.dataTransfer.files
	previewFiles(files)
}

function previewFiles(files){
	previews.value = []
	mergedImage.value = null

	//selectedImages.value = []

	const newPreviews = []

	for(const file of files){
		if(file.type.startsWith('image/')){
			const reader = new FileReader()
			reader.onload = (e)=>{
				newPreviews.push(e.target.result)
				if(newPreviews.length === files.length){
				previews.value = newPreviews
				}
			}
			reader.readAsDataURL(file)
		}
	}
}

function toggleSelection(img){
	const index = selectedImages.value.indexOf(img)
	if(index !== -1){
		selectedImages.value.splice(index, 1)
	}else{
		if(selectedImages.value.length < 4){
			selectedImages.value.push(img)
		}else{
			alert('4枚までしか選択できません')
		}
	}
}

//プレビュー画像が4枚揃ったら自動で結合
watch(selectedImages, async(newVal)=>{
	console.log('bbbb')
	if(newVal.length === 4){
		await mergeFourImages(newVal)
	}
},
{deep: true} //中身の変更にも反応し動作するように
)

//画像を2*2で合成
async function mergeFourImages(imageSrcs){
	const images = await Promise.all(
		imageSrcs.map(
			(src) =>
				new Promise((resolve)=>{
					const img = new Image()
					img.onload = () => resolve(img)
					img.src = src
				})
		)
	)
	// 各画像のサイズを基準に結合画像サイズを決定(最小のサイズに合わせる)
	const tileWidth = Math.min(...images.map((img) => img.width))
	const tileHeight = Math.min(...images.map((img) => img.height))
	const canvas = document.createElement('canvas')
	canvas.width = tileWidth * 2
	canvas.height = tileHeight * 2
	const ctx = canvas.getContext('2d')

	//2*2に
	for(let i = 0;i < 4;i++){
		const x = (i % 2) * tileWidth
		const y = Math.floor(i / 2) * tileHeight
		ctx.drawImage(images[i], 0, 0, tileWidth, tileHeight, x, y, tileWidth, tileHeight)
	}
	mergedImage.value = canvas.toDataURL()
}

</script>
