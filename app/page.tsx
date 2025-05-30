"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "lucide-react";
import { FormEvent, FormEventHandler, useRef, useState } from "react";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

type TodoItem = {
	title: string;
	order: number;
	crossed: boolean;
};

function TodoItemComponent({
	thisItem,
	todoItems,
	setTodoItems,
}: {
	thisItem: TodoItem;
	todoItems: TodoItem[];
	setTodoItems: (value: TodoItem[]) => void;
}) {
	const container = useRef<HTMLDivElement>(null);

	function animateIn() {
		gsap.fromTo(
			`.todo-item-${thisItem.order}`,
			{
				y: 100,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.5,
				ease: "power2.out",
			},
		);
	}

	const { contextSafe } = useGSAP(
		() => {
			// Timeout to wait for the element to be created
			setTimeout(animateIn, 100);
		},
		{ scope: container },
	);

	function onUpArrow() {
		const newItems = [...todoItems];

		const currentIndex = newItems.findIndex(
			(item) => item.order == thisItem.order,
		);
		const aboveIndex = newItems.findIndex(
			(item) => item.order == thisItem.order - 1,
		);

		if (aboveIndex == -1) return;

		newItems[currentIndex].order -= 1;
		newItems[aboveIndex].order += 1;

		newItems.sort((a, b) => a.order - b.order);
		setTodoItems(newItems);
	}

	function onDownArrow() {
		const newItems = [...todoItems];

		const currentIndex = newItems.findIndex(
			(item) => item.order == thisItem.order,
		);
		const belowIndex = newItems.findIndex(
			(item) => item.order == thisItem.order + 1,
		);

		if (belowIndex == -1) return;

		newItems[currentIndex].order += 1;
		newItems[belowIndex].order -= 1;

		newItems.sort((a, b) => a.order - b.order);
		setTodoItems(newItems);
	}

	function onTextClick() {
		const newItems = [...todoItems];

		const thisIndex = newItems.findIndex(
			(item) => item.order == thisItem.order,
		);

		newItems[thisIndex].crossed = !newItems[thisIndex].crossed;
		setTodoItems(newItems);
	}

	function onDelete() {
		const newItems: TodoItem[] = [];

		todoItems.forEach((item) => {
			if (item.order == thisItem.order) return; // Skip this item

			// If the other item is below
			if (item.order > thisItem.order) {
				// Update the order of all the other items 
				item.order -= 1;
			}

			newItems.push(item);
		});

		setTodoItems(newItems);
	}

	return (
		<div
			className={`todo-item-${thisItem.order} opacity-0 w-full flex flex-col`}
			ref={container}
		>
			
			<div className="flex flex-col border border-black justify-center items-center">
				<div className="w-32">


				</div>

				<div className=" w-32 bg-green-500">

				</div>
			</div>

			<Card className="px-4 py-2 flex flex-row">
				<p
					className={`text-xl font-bold flex hover:cursor-pointer items-center flex-grow ${thisItem.crossed && "line-through italic opacity-75"}`}
					onClick={onTextClick}
				>
					{thisItem.title}
				</p>

				<div className="flex gap-2">
					<Button color="danger" onPress={onDelete} isIconOnly>
						<TrashIcon />
					</Button>
					<Button onPress={onUpArrow} isIconOnly>
						<ArrowUpIcon />
					</Button>
					<Button onPress={onDownArrow} isIconOnly>
						<ArrowDownIcon />
					</Button>
				</div>
			</Card>
		</div>
	);
}

export default function Home() {
	const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
	const [inputValue, setInputValue] = useState<string>("");
	const container = useRef<HTMLDivElement>(null);

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setInputValue("");

		const newItems = [
			{
				order: todoItems.length,
				title: inputValue,
				crossed: false,
			},
			...todoItems,
		];
		newItems.sort((a, b) => a.order - b.order);

		setTodoItems(newItems);
	}

	return (
		<section
			ref={container}
			className="flex flex-col items-center justify-center size-full h-screen py-20 px-16"
		>
			<div className="w-full h-full max-w-[600px] flex flex-col gap-8">
				<p className="text-6xl font-bold">To-do List</p>

				<form
					className="flex flex-row w-full gap-4"
					onSubmit={onSubmit}
				>
					<Input
						type="string"
						placeholder="Task Description"
						name="title"
						size="lg"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<Button className=" h-full" type="submit">
						Add
					</Button>
				</form>

				<Divider />

				<div className="task-list flex flex-col gap-2">
					{todoItems.map((todoItem, i) => {
						return (
							<TodoItemComponent
								todoItems={todoItems}
								setTodoItems={setTodoItems}
								thisItem={todoItem}
								key={i}
							/>
						);
					})}

					{todoItems.length == 0 && (
						<p className=" italic opacity-80">
							No items added yet, add some above
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
