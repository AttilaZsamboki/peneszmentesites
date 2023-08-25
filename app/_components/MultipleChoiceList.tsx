"use client";

import CreatableSelect from "react-select/creatable";
import React from "react";

export default function MultipleChoiceCombobox({
	onChange,
	options,
}: {
	onChange: (value: string[]) => void;
	options: { label: string; value: string }[];
}) {
	return (
		<CreatableSelect
			defaultValue={options}
			isClearable
			onChange={(e) => onChange(e.map((e) => e.value))}
			options={options}
			placeholder='Válassz'
			isMulti
		/>
	);
}
