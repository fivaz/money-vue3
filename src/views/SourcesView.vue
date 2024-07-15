<template>
	<MNavbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<h2 class="text-sm font-semibold leading-6">{{ formatMoney(balance) }}</h2>
		</div>

		<ul class="flex flex-col gap-5" role="list">
			<li
				:key="source.id"
				:style="{ order: source.order || sources.length }"
				v-for="source in sources"
			>
				<SourceItem :currentDate="currentDate" :source="source" @edit-source="editSource" />
			</li>
		</ul>

		<div :class="['pt-10 text-center', SECONDARY_COLOR_TEXT]" v-if="sources.length === 0">
			<Landmark class="mx-auto h-16 w-16" />
			<h3 class="mt-2 text-sm font-semibold">No Source</h3>
			<p class="mt-1 text-sm">Get started by creating your first fund source.</p>
			<div class="mt-6 flex justify-center">
				<MButton @click="addSource" color="indigo" size="big" type="button">
					<Plus aria-hidden="true" class="h-5 w-5" />
					New Source
				</MButton>
			</div>
		</div>

		<MButton
			@click="addSource"
			class="fixed bottom-0 right-0 z-10 m-3"
			color="indigo"
			size="big"
			type="button"
		>
			<Plus aria-hidden="true" class="h-5 w-5" />
			New Source
		</MButton>

		<SourceForm
			:length="sources.length"
			:show="showForm"
			:source="editingSource"
			@close="showForm = false"
		/>
	</MNavbar>
</template>

<script setup lang="ts">
import type { Source } from '@/lib/source'

import DateHeader from '@/components/DateHeader.vue'
import MButton from '@/components/MButton.vue'
import MNavbar from '@/components/MNavbar.vue'
import SourceForm from '@/components/source/SourceForm.vue'
import SourceItem from '@/components/source/SourceItem.vue'
import { SECONDARY_COLOR_TEXT, SOURCES, USERS } from '@/lib/consts'
import { formatMoney, icons } from '@/lib/utils'
import { collection } from 'firebase/firestore'
import { Landmark, Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'

const currentDate = ref(new Date())

const showForm = ref(false)

const db = useFirestore()
const user = useCurrentUser()

const sources = useCollection<Source>(collection(db, USERS, user.value!.uid, SOURCES))

const editingSource = ref<Source>(getEmptySource())

const balance = computed(() => sources.value.reduce((sum, source) => sum + source.balance, 0))

function editSource(source: Source) {
	showForm.value = true
	editingSource.value = source
}

function getEmptySource(): Source {
	return {
		balance: 0,
		id: '',
		name: '',
		order: null,
	}
}

function addSource() {
	showForm.value = true
	editingSource.value = getEmptySource()
}
</script>
