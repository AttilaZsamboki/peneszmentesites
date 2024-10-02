"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export function OnboardingSurveyComponent({ children }: { children: React.ReactNode }) {
	const [step, setStep] = useState(1);
	const [responses, setResponses] = useState({
		companySize: "",
		industry: "",
		primaryGoal: "",
		currentCRM: "",
		dataImportNeeded: "",
		teamSize: "",
		salesProcess: "",
	});

	const handleInputChange = (name: string, value: string) => {
		setResponses((prev) => ({ ...prev, [name]: value }));
	};

	const nextStep = () => setStep(step + 1);
	const prevStep = () => setStep(step - 1);

	const renderStep = () => {
		switch (step) {
			case 1:
				return <Step1 responses={responses} handleInputChange={handleInputChange} />;
			case 2:
				return responses.companySize === "small" ? (
					<Step2Small responses={responses} handleInputChange={handleInputChange} />
				) : (
					<Step2Large responses={responses} handleInputChange={handleInputChange} />
				);
			case 3:
				return responses.primaryGoal === "sales" ? (
					<Step3Sales responses={responses} handleInputChange={handleInputChange} />
				) : (
					<Step3Support responses={responses} handleInputChange={handleInputChange} />
				);
			case 4:
				return <FinalStep responses={responses} />;
			default:
				return null;
		}
	};

	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className='w-full max-w-lg mx-auto'>
				<DialogHeader>
					<DialogTitle>CRM Onboarding Survey</DialogTitle>
					<DialogDescription>Help us customize your CRM experience</DialogDescription>
				</DialogHeader>
				{renderStep()}
				<DialogFooter className='flex justify-between'>
					{step > 1 && (
						<Button onClick={prevStep} variant='outline'>
							Previous
						</Button>
					)}
					{step < 4 && (
						<Button onClick={nextStep} className='ml-auto'>
							Next
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function Step1({ responses, handleInputChange }: StepProps) {
	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='companySize'>What's the size of your company?</Label>
				<Select
					onValueChange={(value) => handleInputChange("companySize", value)}
					value={responses.companySize}>
					<SelectTrigger id='companySize'>
						<SelectValue placeholder='Select company size' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='small'>1-50 employees</SelectItem>
						<SelectItem value='medium'>51-200 employees</SelectItem>
						<SelectItem value='large'>201+ employees</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='space-y-2'>
				<Label htmlFor='industry'>What industry are you in?</Label>
				<Input
					id='industry'
					value={responses.industry}
					onChange={(e) => handleInputChange("industry", e.target.value)}
					placeholder='Enter your industry'
				/>
			</div>
		</div>
	);
}

function Step2Small({ responses, handleInputChange }: StepProps) {
	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label>What's your primary goal with our CRM?</Label>
				<RadioGroup
					onValueChange={(value) => handleInputChange("primaryGoal", value)}
					value={responses.primaryGoal}>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='sales' id='sales' />
						<Label htmlFor='sales'>Increase sales</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='support' id='support' />
						<Label htmlFor='support'>Improve customer support</Label>
					</div>
				</RadioGroup>
			</div>
		</div>
	);
}

function Step2Large({ responses, handleInputChange }: StepProps) {
	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label>Are you currently using any CRM system?</Label>
				<RadioGroup
					onValueChange={(value) => handleInputChange("currentCRM", value)}
					value={responses.currentCRM}>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='yes' id='yes-crm' />
						<Label htmlFor='yes-crm'>Yes</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='no' id='no-crm' />
						<Label htmlFor='no-crm'>No</Label>
					</div>
				</RadioGroup>
			</div>
			<div className='space-y-2'>
				<Label>Do you need to import existing customer data?</Label>
				<RadioGroup
					onValueChange={(value) => handleInputChange("dataImportNeeded", value)}
					value={responses.dataImportNeeded}>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='yes' id='yes-import' />
						<Label htmlFor='yes-import'>Yes</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='no' id='no-import' />
						<Label htmlFor='no-import'>No</Label>
					</div>
				</RadioGroup>
			</div>
		</div>
	);
}

function Step3Sales({ responses, handleInputChange }: StepProps) {
	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='teamSize'>How many people are on your sales team?</Label>
				<Input
					id='teamSize'
					type='number'
					value={responses.teamSize}
					onChange={(e) => handleInputChange("teamSize", e.target.value)}
					placeholder='Enter team size'
				/>
			</div>
		</div>
	);
}

function Step3Support({ responses, handleInputChange }: StepProps) {
	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label>How would you describe your current customer support process?</Label>
				<RadioGroup
					onValueChange={(value) => handleInputChange("salesProcess", value)}
					value={responses.salesProcess}>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='manual' id='manual' />
						<Label htmlFor='manual'>Mostly manual</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='partially-automated' id='partially-automated' />
						<Label htmlFor='partially-automated'>Partially automated</Label>
					</div>
					<div className='flex items-center space-x-2'>
						<RadioGroupItem value='fully-automated' id='fully-automated' />
						<Label htmlFor='fully-automated'>Fully automated</Label>
					</div>
				</RadioGroup>
			</div>
		</div>
	);
}

function FinalStep({ responses }: { responses: SurveyResponses }) {
	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-medium'>Thank you for completing the survey!</h3>
			<p>Here's a summary of your responses:</p>
			<ul className='list-disc pl-5 space-y-2'>
				<li>Company Size: {responses.companySize}</li>
				<li>Industry: {responses.industry}</li>
				<li>Primary Goal: {responses.primaryGoal}</li>
				{responses.currentCRM && <li>Current CRM: {responses.currentCRM}</li>}
				{responses.dataImportNeeded && <li>Data Import Needed: {responses.dataImportNeeded}</li>}
				{responses.teamSize && <li>Sales Team Size: {responses.teamSize}</li>}
				{responses.salesProcess && <li>Support Process: {responses.salesProcess}</li>}
			</ul>
			<p>We'll use this information to customize your CRM experience.</p>
		</div>
	);
}

interface StepProps {
	responses: SurveyResponses;
	handleInputChange: (name: string, value: string) => void;
}

interface SurveyResponses {
	companySize: string;
	industry: string;
	primaryGoal: string;
	currentCRM: string;
	dataImportNeeded: string;
	teamSize: string;
	salesProcess: string;
}
