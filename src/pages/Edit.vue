<template>
	<div>
		<div class="p-6">
			<h2 class="text-2xl font-bold mb-4">画像インポート</h2>
			<!-- Drug & Drop -->
			<div
				@dragover.prevent
				@drop.prevent="handleDrop"
				class="border-2 border-dashed border-gray-400 rounded p-10 text-center text-gray-50"
			>
				ここに画像
			</div>
				<!-- ファイル選択 -->
				<input type="file" multiple @change="handleFileChange" accept="image/*" />

				<!-- プレビュー表示 -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
					<div
						v-for="(img, index) in previews"
						:key="index"
						class="border rounded overflow-hidden"
					>
						<img :src="img" class="w-full object-cover" />
					</div>
				</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const previews = ref([])

function handleFileChange(eve){
	const files = eve.target.files
	previewFiles(files)
}

function previewFiles(files){
	previews.value = []
	for(const file of files){
		if(file.type.startsWith('image/')){
			const reader = new FileReader()
			reader.onload = (e)=>{
				previews.value.push(e.target.result)
			}
			reader.readAsDataURL(file)
		}
	}
}
</script>
