"use client";
import { useState } from "react";
import { Users, Hand, Heart, Factory, Briefcase } from "lucide-react";
import { Box, Ban, BadgeCheck, Layers, Leaf, MapPin, Sparkles, Recycle } from "lucide-react";


function getIconForSocialLabel(label) {
	switch (label) {
		case "Women Owned":
			return <Heart className="w-10 h-10" />;
		case "Minority Owned":
			return <Users className="w-10 h-10" />;
		case "Small Business":
			return <Briefcase className="w-10 h-10" />;
		case "Ethical Labor":
			return <Factory className="w-10 h-10" />;
		case "Local Artisan":
			return <Hand className="w-10 h-10" />;
		default:
			return <Users className="w-10 h-10" />;
	}
}



export default function ProductTabs({ product }) {
	const [active, setActive] = useState("description");

	const tabs = [
		{ label: "Description", key: "description" },
		{ label: "Sustainability", key: "sustainability" },
		{ label: "Details", key: "details" },
		{ label: "Care and End of Life", key: "care" },
	];

	const tabConten1t = {
		description: product.description,
		sustainability: `This product is made from recyclable copper, shipped plastic-free, and supports responsible sourcing.`,
		care: product.careInstructions,
	};




	return (
		<div className="w-full bg-orange-50 py-10 min-h-[80vh]">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex justify-start flex-wrap gap-x-16 font-medium mb-10">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActive(tab.key)}
							className={`pb-2 transition cursor-pointer text-2xl ${active === tab.key
								? "text-gray-900 border-b-2 border-gray-700"
								: "text-gray-500 hover:text-gray-700"
								}`}
						>
							{tab.label}
						</button>
					))}
				</div>



				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-15 text-gray-700 leading-relaxed">
					{active === "description" && (
						<>
							<div>
								<p className="whitespace-pre-line text-gray-700">
									{product.description}
								</p>

							</div>
							{product.socialOptions?.length > 0 && (
								<div className="mt-0">
									<div className="flex flex-wrap gap-12 text-gray-700 text-lg">
										{product.socialOptions.map((label, i) => (
											<div key={i} className="flex items-center gap-2">
												{getIconForSocialLabel(label)}
												<span className="underline">{label}</span>
											</div>
										))}
									</div>
								</div>
							)}

						</>
					)}
					{active === "sustainability" && (
						<>
							<div className="text-gray-700">
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<Box className="w-7 h-7" /> Packaging
								</h3>
								<ul className="list-disc list-inside mb-6">
									{product.packaging?.map((item, idx) => (
										<li key={idx}>{item}</li>
									))}
								</ul>

								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<Leaf className="w-7 h-7" /> Earth-Friendly Features
								</h3>
								<ul className="list-disc list-inside mb-6">
									{product.earthFriendly?.map((item, idx) => (
										<li key={idx}>{item}</li>
									))}
								</ul>

							</div>
							<div className="text-gray-700">
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<Ban className="w-7 h-7" /> Made Without
								</h3>
								<ul className="list-disc list-inside mb-6">
									{product.madeWithout?.map((item, idx) => (
										<li key={idx}>{item}</li>
									))}
								</ul>
							</div>

						</>
					)}
					{active === "details" && (
						<>

							<div className="text-gray-700">
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<Layers className="w-7 h-7" /> Materials
								</h3>
								<p className="mb-6">{product.materials || "Not specified"}</p>
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<MapPin className="w-7 h-7" /> Origin
								</h3>
								<p className="mb-6">{product.origin || "Not specified"}</p>

							</div>
							<div className="text-gray-700">
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<BadgeCheck className="w-7 h-7" /> Certifications
								</h3>
								<ul className="list-disc list-inside mb-6">
									{product.cert?.map((item, idx) => (
										<li key={idx}>{item}</li>
									))}
								</ul>

							</div>
						</>
					)}
					{active === "care" && (
						<>

							<div className="text-gray-700">
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<Sparkles className="w-7 h-7" /> Product Care
								</h3>
								<p className="mb-6">{product.careInstructions || "Not specified"}</p>


							</div>
							<div className="text-gray-700">
								<h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
									<Recycle className="w-7 h-7" /> End of Life
								</h3>
								<p className="mb-6">{product.endOfLife || "Not specified"}</p>


							</div>
						</>
					)}




				</div>


			</div>
		</div >
	);
}
