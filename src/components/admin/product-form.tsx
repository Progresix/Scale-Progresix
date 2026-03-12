"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/types/database";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  is_active: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string; data?: Product }>;
  isEditing?: boolean;
}

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [existingFile, setExistingFile] = useState<string | null>(
    initialData?.file_url || null
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [removeFile, setRemoveFile] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  const nameValue = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing || !initialData?.slug) {
      const slug = generateSlug(nameValue);
      setValue("slug", slug);
    }
  }, [nameValue, isEditing, initialData?.slug, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 5MB");
        return;
      }
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRemoveImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 50MB");
        return;
      }
      setFileName(file.name);
      setRemoveFile(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setRemoveImage(true);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setExistingFile(null);
    setRemoveFile(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFormSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("price", data.price.toString());
      formData.append("is_active", data.is_active.toString());

      // Handle image
      if (imageInputRef.current?.files?.[0]) {
        formData.append("image", imageInputRef.current.files[0]);
      } else if (removeImage) {
        formData.append("remove_image", "true");
      }

      // Handle file
      if (fileInputRef.current?.files?.[0]) {
        formData.append("file", fileInputRef.current.files[0]);
      } else if (removeFile) {
        formData.append("remove_file", "true");
      }

      const result = await onSubmit(formData);

      if (result.success) {
        toast.success(
          isEditing
            ? "Produk berhasil diperbarui"
            : "Produk berhasil ditambahkan"
        );
      } else {
        toast.error(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Informasi Produk
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Detail dasar produk digital Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900 dark:text-white">
                  Nama Produk <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Contoh: Website Template Pro"
                  className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-gray-900 dark:text-white">
                  Slug URL <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    /products/
                  </span>
                  <Input
                    id="slug"
                    {...register("slug")}
                    placeholder="website-template-pro"
                    className="flex-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    disabled={isLoading}
                  />
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Slug dibuat otomatis dari nama produk, dapat diedit manual
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-900 dark:text-white"
                >
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Jelaskan tentang produk Anda..."
                  rows={5}
                  className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-gray-900 dark:text-white"
                >
                  Harga (Rp) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price")}
                  placeholder="299000"
                  className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  disabled={isLoading}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label
                    htmlFor="is_active"
                    className="text-gray-900 dark:text-white"
                  >
                    Status Aktif
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Produk aktif akan ditampilkan di toko
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={watch("is_active")}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Files */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Gambar Produk
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Upload gambar thumbnail (max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Klik untuk upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, WebP
                    </p>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                File Produk
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Upload file digital (max 50MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fileName || existingFile ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                      {fileName || "File tersimpan"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Klik untuk upload</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ZIP, PDF, atau file lainnya
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.history.back()}
                  disabled={isLoading}
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
