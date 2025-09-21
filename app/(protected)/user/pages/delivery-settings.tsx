/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Ruler,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  MapPinPlus
} from "lucide-react";
import { shippingAPI } from "@/app/(handlers)/shipping/api";
import { ShippingConfig, ShippingZone } from "@/constants/types";
import {
  useDeleteShippingZone,
  useGetMyShippingConfig,
  useGetMyShippingZones,
  useUpsertShippingConfig,
  useCreateShippingZone,
  useUpdateShippingZone
} from "@/app/(handlers)/shipping/queries";
import { toast } from "sonner";
import Skeleton from "@/app/(general)/_compoenents/skeleton";

type CoverageType = "radius" | "manual";

type Zone = {
  id: string;
  name: string;
  coverageType: CoverageType;
  coverageValue: string; // e.g. "Within 10km" or "Lagos: Ikeja, Yaba"
  flatFee: number;
  freeShipMin?: number;
  estimatedDays?: number;
  // order amount for free shipping
};

const currency = (n: number | undefined) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
      }).format(n)
    : "—";

export default function DeliverySettings() {
  const [model, setModel] = useState<"zones" | "distance">("zones");
  const [hasFallBackDistanceBasedPricing, sethasFallBackDistanceBasedPricing] =
    useState(false);
  // Zones state
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Distance model state
  const [baseFee, setBaseFee] = useState<number>(0);
  const [perKm, setPerKm] = useState<number>(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(0);

  const suggestedRates = [50, 100, 200];

  // React Query: load config and zones
  const { data: cfg, isLoading: cfgLoading } = useGetMyShippingConfig();
  const { data: zns, isLoading: zonesLoading } = useGetMyShippingZones();

  useEffect(() => {
    if (cfg) {
      setModel(
        ((cfg as ShippingConfig).model as "zones" | "distance") ?? "zones"
      );
      setBaseFee((cfg as ShippingConfig).base_fee ?? 0);
      setPerKm((cfg as ShippingConfig).per_km ?? 0);
    }
  }, [cfg]);

  useEffect(() => {
    if (cfg) {
      if (cfg.base_fee && cfg.per_km) {
        sethasFallBackDistanceBasedPricing(true);
      }
    }
  }, [cfg]);

  useEffect(() => {
    if (Array.isArray(zns)) {
      setZones(
        (zns as ShippingZone[]).map((z) => ({
          id: z.id,
          name: z.name,
          coverageType: z.coverage_type as CoverageType,
          coverageValue: z.coverage_value,
          flatFee: z.flat_fee,
          freeShipMin: z.free_ship_min ?? undefined,
          estimatedDays: z.estimatedDays ?? undefined
        }))
      );
    }
  }, [zns]);

  // Mutations
  const upsertConfigMutation = useUpsertShippingConfig();
  const createZoneMutation = useCreateShippingZone();
  const updateZoneMutation = useUpdateShippingZone();
  const deleteZoneMutation = useDeleteShippingZone();

  const previewFees = useMemo(() => {
    const distances = [5, 10, 20];
    if (model !== "distance") {
      return distances.map((d) => ({
        distance: d,
        fee: Math.max(0, Math.round(baseFee + perKm * d))
      }));
    }
    return distances.map((d) => ({
      distance: d,
      fee: Math.max(0, Math.round(baseFee + perKm * d))
    }));
  }, [model, baseFee, perKm]);

  const handleSave = async () => {
    const payload = {
      model,
      base_fee: model === "distance" ? baseFee : undefined,
      per_km: model === "distance" ? perKm : undefined
    } as ShippingConfig & { base_fee?: number; per_km?: number };
    try {
      await upsertConfigMutation.mutateAsync(payload);
      toast.success("Saved");
    } catch (e) {
      console.error("Failed to save shipping config", e);
      toast.success("Failed");
    }
  };
  const handleSaveFallback = async () => {
    const payload = {
      model: "zones",
      base_fee: baseFee,
      per_km: perKm
    } as ShippingConfig & { base_fee?: number; per_km?: number };
    try {
      await upsertConfigMutation.mutateAsync(payload);
      toast.success("Saved");
    } catch (e) {
      console.error("Failed to save shipping config", e);
      toast.success("Failed");
    }
  };

  const openCreateZone = () => {
    setEditingZone({
      id: "",
      name: "",
      coverageType: "radius",
      coverageValue: "",
      flatFee: 0,
      freeShipMin: undefined,
      estimatedDays: undefined
    });
    setZoneModalOpen(true);
  };

  const openEditZone = (z: Zone) => {
    setEditingZone({ ...z });
    setZoneModalOpen(true);
  };

  const upsertZone = async () => {
    if (!editingZone) return;
    if (!editingZone.name || !editingZone.coverageValue) return;
    try {
      if (editingZone.id) {
        const updated = await updateZoneMutation.mutateAsync({
          id: editingZone.id,
          data: {
            name: editingZone.name,
            coverage_type: editingZone.coverageType,
            coverage_value: editingZone.coverageValue,
            flat_fee: editingZone.flatFee,
            free_ship_min: editingZone.freeShipMin ?? null,
            estimatedDays: editingZone.estimatedDays
          }
        });
        setZones((prev) =>
          prev.map((z) =>
            z.id === editingZone.id
              ? {
                  id: updated.id,
                  name: updated.name,
                  coverageType: updated.coverage_type as CoverageType,
                  coverageValue: updated.coverage_value,
                  flatFee: updated.flat_fee,
                  freeShipMin: updated.free_ship_min ?? undefined
                }
              : z
          )
        );
      } else {
        const created = await createZoneMutation.mutateAsync({
          name: editingZone.name,
          coverage_type: editingZone.coverageType,
          coverage_value: editingZone.coverageValue,
          flat_fee: editingZone.flatFee,
          free_ship_min: editingZone.freeShipMin ?? null,
          estimatedDays: editingZone.estimatedDays
        });
        setZones((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.name,
            coverageType: created.coverage_type as CoverageType,
            coverageValue: created.coverage_value,
            flatFee: created.flat_fee,
            freeShipMin: created.free_ship_min ?? undefined,
            estimatedDays: created.estimatedDays
          }
        ]);
      }
    } catch (e) {
      console.error("Failed to save zone", e);
    } finally {
      setZoneModalOpen(false);
      setEditingZone(null);
    }
  };

  const removeZone = async (id: string) => {
    try {
      await deleteZoneMutation.mutateAsync(id);
      toast.success("Saved");
      setZones((prev) => prev.filter((z) => z.id !== id));
    } catch (e) {
      toast.error("Failed");
      console.error("Failed to delete zone", e);
    }
  };

  return (
    <div className="flex px-10 py-4 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>🚚</span> Delivery Settings
        </h2>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin size={14} /> Zones
          </Badge>
          <Switch
            checked={model === "distance"}
            onCheckedChange={(v) => setModel(v ? "distance" : "zones")}
          />
          <Badge variant="secondary" className="flex items-center gap-1">
            <Ruler size={14} /> Distance
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline">
            Zones: Set fixed delivery fees by area or radius
          </Badge>
          <Badge variant="outline">Distance: Fee = Base + (Rate × km)</Badge>
        </div>
      </Card>

      {model === "zones" && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <MapPin size={18} /> Fallback
            </div>
          </div>
          <div className="-mt-2 max-w-full">
            <Badge variant="secondary" className="text-xs py-2">
              Define areas and set flat fees. Example: Mainland Lagos within
              10km → ₦2000
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="base-fee">Base Fee (₦)</Label>
              <Input
                id="base-fee"
                type="number"
                min={0}
                value={baseFee}
                onChange={(e) => setBaseFee(Number(e.target.value || 0))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="per-km">Per KM Rate (₦/km)</Label>
              <Input
                id="per-km"
                type="number"
                min={0}
                value={perKm}
                onChange={(e) => setPerKm(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-3">
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleSaveFallback}
                disabled={upsertConfigMutation.isPending}
              >
                {upsertConfigMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {model === "zones" ? (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <MapPin size={18} /> Shipping Zones
            </div>
            <Button
              disabled={!hasFallBackDistanceBasedPricing}
              size="sm"
              onClick={openCreateZone}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Zone
            </Button>
          </div>
          <div className="-mt-2 max-w-full">
            <Badge variant="secondary" className="text-xs py-2">
              Define areas and set flat fees. Example: Mainland Lagos within
              10km → ₦2000
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone Name</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Delivery Fee</TableHead>
                  <TableHead>Free Shipping Above</TableHead>
                  <TableHead>EST Delivery (Days)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zonesLoading ? (
                  <div className="grid gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  zones.map((z) => (
                    <TableRow key={z.id}>
                      <TableCell className="font-medium">{z.name}</TableCell>
                      <TableCell>{z.coverageValue}</TableCell>
                      <TableCell>{currency(z.flatFee)}</TableCell>
                      <TableCell>{currency(z.freeShipMin)}</TableCell>
                      <TableCell>{z.estimatedDays}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditZone(z)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeZone(z.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {zones.length === 0 && <TableCaption>No zones yet</TableCaption>}
            </Table>
          </div>

          <Dialog
            open={zoneModalOpen}
            onOpenChange={(o) =>
              o ? setZoneModalOpen(true) : setZoneModalOpen(false)
            }
          >
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>
                  {editingZone?.id ? "Edit Zone" : "Add Zone"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="zone-name">Zone Name</Label>
                  <Input
                    id="zone-name"
                    placeholder="e.g. Mainland Lagos"
                    value={editingZone?.name ?? ""}
                    onChange={(e) =>
                      setEditingZone((z) =>
                        z ? { ...z, name: e.target.value } : z
                      )
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Coverage</Label>
                  <Tabs
                    value={editingZone?.coverageType ?? "radius"}
                    onValueChange={(v) =>
                      setEditingZone((z) =>
                        z
                          ? {
                              ...z,
                              coverageType: v as CoverageType,
                              coverageValue: ""
                            }
                          : z
                      )
                    }
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="radius">Radius</TabsTrigger>
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                    </TabsList>
                    <TabsContent value="radius" className="mt-3">
                      <Badge variant="outline" className="mb-3 text-xs">
                        Radius around store (e.g., Within 10km radius)
                      </Badge>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <Label htmlFor="radius-km">Radius (km)</Label>
                          <Input
                            id="radius-km"
                            type="number"
                            min={0}
                            placeholder="10"
                            value={
                              (editingZone?.coverageValue.match(
                                /\d+/
                              )?.[0] as string) ?? ""
                            }
                            onChange={(e) =>
                              setEditingZone((z) =>
                                z
                                  ? {
                                      ...z,
                                      coverageValue: `Within ${e.target.value}km radius`
                                    }
                                  : z
                              )
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="flat-fee">
                            Flat Delivery Fee (₦)
                          </Label>
                          <Input
                            id="flat-fee"
                            type="number"
                            min={0}
                            placeholder="2000"
                            value={editingZone?.flatFee ?? 0}
                            onChange={(e) =>
                              setEditingZone((z) =>
                                z
                                  ? {
                                      ...z,
                                      flatFee: Number(e.target.value || 0)
                                    }
                                  : z
                              )
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="manual" className="mt-3">
                      <Badge variant="outline" className="mb-3 text-xs">
                        Select states/cities/areas or postal codes (e.g., Lagos:
                        Ikeja, Yaba)
                      </Badge>
                      <div className="grid gap-2">
                        <Label htmlFor="manual-coverage">
                          States/Cities/Areas
                        </Label>
                        <Input
                          id="manual-coverage"
                          placeholder="e.g. Lagos: Ikeja, Yaba or Postal codes: 101223"
                          value={editingZone?.coverageValue ?? ""}
                          onChange={(e) =>
                            setEditingZone((z) =>
                              z ? { ...z, coverageValue: e.target.value } : z
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2 mt-3">
                        <Label htmlFor="flat-fee-manual">
                          Flat Delivery Fee (₦)
                        </Label>
                        <Input
                          id="flat-fee-manual"
                          type="number"
                          min={0}
                          placeholder="2500"
                          value={editingZone?.flatFee ?? 0}
                          onChange={(e) =>
                            setEditingZone((z) =>
                              z
                                ? { ...z, flatFee: Number(e.target.value || 0) }
                                : z
                            )
                          }
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="grid gap-2">
                    <Label htmlFor="per-km">Estimated Days Of Delivery</Label>
                    <Input
                      required
                      id="est-days"
                      type="number"
                      min={0}
                      placeholder="e.g. 3"
                      value={editingZone?.estimatedDays ?? ""}
                      onChange={(e) =>
                        setEditingZone((z) =>
                          z
                            ? { ...z, estimatedDays: Number(e.target.value) }
                            : z
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2 mt-3">
                    <Label htmlFor="free-min">
                      Free Shipping Above (₦) - optional
                    </Label>
                    <Input
                      id="free-min"
                      type="number"
                      min={0}
                      placeholder="20000"
                      value={editingZone?.freeShipMin ?? ""}
                      onChange={(e) =>
                        setEditingZone((z) =>
                          z
                            ? {
                                ...z,
                                freeShipMin: e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              }
                            : z
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setZoneModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={upsertZone}
                  disabled={
                    createZoneMutation.isPending ||
                    updateZoneMutation.isPending ||
                    !hasFallBackDistanceBasedPricing
                  }
                >
                  {createZoneMutation.isPending || updateZoneMutation.isPending
                    ? "Saving..."
                    : "Save Zone"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <Card className="p-4 space-y-5">
          <div className="flex items-center gap-2 font-medium">
            <Ruler size={18} /> Delivery Formula
          </div>
          <Badge variant="secondary" className="text-xs -mt-2 w-fit">
            Customers pay Base Fee + (Per‑KM × distance). Example: Base ₦500,
            5km at ₦100/km → ₦1000
          </Badge>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="base-fee">Base Fee (₦)</Label>
              <Input
                id="base-fee"
                type="number"
                min={0}
                value={baseFee}
                onChange={(e) => setBaseFee(Number(e.target.value || 0))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="per-km">Per KM Rate (₦/km)</Label>
              <Input
                id="per-km"
                type="number"
                min={0}
                value={perKm}
                onChange={(e) => setPerKm(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet size={16} /> Suggested Rates:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedRates.map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={perKm === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPerKm(r)}
                >
                  {currency(r)} / km
                </Button>
              ))}
            </div>
          </div>

          <Card className="p-3">
            <div className="font-medium mb-2 flex items-center gap-2">
              <span>📊</span> Preview (Example Calculation)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {previewFees.map((p) => (
                <div
                  key={p.distance}
                  className="rounded-md border p-3 text-center"
                >
                  <div className="text-sm text-muted-foreground">
                    {p.distance}km
                  </div>
                  <div className="text-lg font-semibold">{currency(p.fee)}</div>
                </div>
              ))}
            </div>
          </Card>
        </Card>
      )}

      <div className="sticky bottom-0 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-3">
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={upsertConfigMutation.isPending}
          >
            {upsertConfigMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
