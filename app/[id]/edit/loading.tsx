"use client";
import { Button } from "@/components/ui/button";
import { Typography } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";

export default function EditLoading() {
	return (
		<div className='w-full overflow-y-scroll h-screen pb-10 mb-10'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 w-11/12 lg:px-10 lg:w-11/12'>
					<div className='rounded-lg border bg-card text-card-htmlForeground shadow-sm'>
						<div className='flex flex-col space-y-1.5 p-6'>
							<h3 className='text-2xl font-semibold leading-none tracking-tight'>Tételek</h3>
						</div>
						<div className='p-8 transhtmlForm'>
							<div>
								<div className='rounded-lg border bg-card text-card-htmlForeground shadow-sm my-5'>
									<div className='w-full lg:overflow-hidden overflow-x-scroll'>
										<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
											<thead>
												<tr>
													<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
														<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
															Név
														</p>
													</th>
													<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
														<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
															Darab + Hely
														</p>
													</th>
													<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
														<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
															Nettó egységár
														</p>
													</th>
													<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
														<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
															Nettó összesen
														</p>
													</th>
												</tr>
											</thead>
											<tbody className='relative'>
												{Array.from({ length: 5 }).map((_, index) => {
													const classes = "p-4";

													return (
														<tr key={index} className='border-b border-blue-gray-50'>
															<td className={classes}>
																<Skeleton width={500} height={30} />
															</td>
															<td className={classes}>
																<Skeleton width={300} height={30} />
															</td>
															<td className={classes}>
																<Skeleton width={100} height={30} />
															</td>
															<td className={classes}>
																<Skeleton width={100} height={30} />
															</td>
														</tr>
													);
												})}
											</tbody>
											<tfoot className='bg-gray'>
												<tr>
													<td className='border-b border-t-0 border-blue-gray-100 bg-blue-gray-50 p-4'>
														<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
															Össz:
														</p>
													</td>
													<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
													<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
													<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
														<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
															<Skeleton width={70} height={30} />
														</p>
													</td>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
								<div className='mt-8'>
									<div className='flex lg:flex-row flex-col justify-between items-center w-full mb-2 '>
										<div className='flex flex-col justify-items items-center w-full'>
											<div className='flex flex-col w-11/12 px-2 lg:items-start sm:items-center justify-center lg:my-4 lg:justify-between text-center'>
												<h5 className='block antialiased tracking-normal font-sans text-xl leading-snug font-semibold text-gradient-to-tr from-gray-900 to-gray-800 lg:my-0 text-left'>
													Egyéb
												</h5>
											</div>
										</div>
									</div>
									<div className='rounded-lg border bg-card text-card-htmlForeground shadow-sm'>
										<div className='w-full lg:overflow-hidden overflow-x-scroll'>
											<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
												<thead>
													<tr>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Név
															</p>
														</th>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Nettó egységár
															</p>
														</th>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Nettó összesen
															</p>
														</th>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
																strokeWidth='1.5'
																stroke='currentColor'
																aria-hidden='true'
																className='w-5 h-5 cursor-pointer'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'></path>
															</svg>
														</th>
													</tr>
												</thead>
												<tbody className='relative'>
													{Array.from({ length: 2 }).map((_, index) => {
														const classes = "p-4";

														return (
															<tr key={index} className='border-b border-blue-gray-50'>
																<td className={classes}>
																	<Skeleton width={500} height={30} />
																</td>
																<td className={classes}>
																	<Skeleton width={300} height={30} />
																</td>
																<td className={classes}>
																	<Skeleton width={100} height={30} />
																</td>
																<td className={classes}>
																	<Skeleton width={100} height={30} />
																</td>
															</tr>
														);
													})}
												</tbody>
												<tfoot className='bg-gray'>
													<tr>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Össz:
															</p>
														</td>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																<Skeleton width={100} height={30} />
															</p>
														</td>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
													</tr>
												</tfoot>
											</table>
										</div>
									</div>
								</div>
								<div className='mt-8'>
									<div className='flex lg:flex-row flex-col justify-between items-center w-full mb-2 '>
										<div className='flex flex-col justify-items items-center w-full'>
											<div className='flex flex-col w-11/12 px-2 lg:items-start sm:items-center justify-center lg:my-4 lg:justify-between text-center'>
												<h5 className='block antialiased tracking-normal font-sans text-xl leading-snug font-semibold text-gradient-to-tr from-gray-900 to-gray-800 lg:my-0 text-left'>
													Összesítés
												</h5>
											</div>
										</div>
									</div>
									<div className='rounded-lg border bg-card text-card-htmlForeground shadow-sm'>
										<div className='w-full lg:overflow-hidden overflow-x-scroll'>
											<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
												<thead>
													<tr>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Név
															</p>
														</th>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Nettó
															</p>
														</th>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																ÁFA
															</p>
														</th>
														<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Bruttó
															</p>
														</th>
													</tr>
												</thead>
												<tbody>
													{Array.from({ length: 3 }).map((_, index) => {
														const classes = "p-4";

														return (
															<tr key={index} className='border-b border-blue-gray-50'>
																<td className={classes}>
																	<Skeleton width={500} height={30} />
																</td>
																<td className={classes}>
																	<Skeleton width={300} height={30} />
																</td>
																<td className={classes}>
																	<Skeleton width={100} height={30} />
																</td>
																<td className={classes}>
																	<Skeleton width={100} height={30} />
																</td>
															</tr>
														);
													})}
												</tbody>
												<tfoot className='bg-gray'>
													<tr>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																Össz:
															</p>
														</td>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																<Skeleton width={100} height={30} />
															</p>
														</td>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																<Skeleton width={100} height={30} />
															</p>
														</td>
														<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
															<p className='block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70'>
																<Skeleton width={100} height={30} />
															</p>
														</td>
													</tr>
												</tfoot>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className='flex flex-row justify-end gap-3 py-4'>
								<Button disabled={true}>Következő</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
