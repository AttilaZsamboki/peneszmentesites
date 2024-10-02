"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Email Integration</h3>
				<p className='text-sm text-muted-foreground'>Configure your email integration settings.</p>
			</div>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='email-provider'>Email Provider</Label>
					<Select>
						<SelectTrigger id='email-provider'>
							<SelectValue placeholder='Select email provider' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='gmail'>Gmail</SelectItem>
							<SelectItem value='outlook'>Outlook</SelectItem>
							<SelectItem value='custom'>Custom SMTP</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='email-address'>Email Address</Label>
					<Input id='email-address' placeholder='Enter your email address' />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='smtp-host'>SMTP Host</Label>
					<Input id='smtp-host' placeholder='Enter SMTP host' />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='smtp-port'>SMTP Port</Label>
					<Input id='smtp-port' placeholder='Enter SMTP port' />
				</div>
			</div>
			<Button>Save Email Settings</Button>
		</div>
	);
}
