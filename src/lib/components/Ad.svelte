<script lang="ts">
    import { onMount } from "svelte";
    import { adsOptedOut } from "$lib/privacy";

    interface Props {
        placementName: string;
        alias?: string;
    }

    let { placementName, alias }: Props = $props();

    let el: HTMLDivElement | undefined = $state();

    onMount(() => {
        if (adsOptedOut()) {
            return;
        }

        let placement: any;

        const handleAdd = function (admanager: any, scope: any) {
            if (placementName.includes(",")) {
                const [desktopPlacement, mobilePlacement] = placementName
                    .split(",")
                    .map((p) => p.trim());
                placement = scope.Config.buildPlacement((configBuilder: any) => {
                    configBuilder.add(desktopPlacement);
                    configBuilder.addDefaultOrUnique(mobilePlacement).setBreakPoint("mobile");
                }, alias).display(el);
            } else if (placementName === "vertical_sticky") {
                scope.Config.verticalSticky().display(alias);
            } else {
                const isStickyOrVideoSlider = [
                    "horizontal_sticky",
                    "mobile_horizontal_sticky",
                    "video_slider",
                ].includes(placementName);
                placement = scope.Config.get(placementName, alias).display(
                    isStickyOrVideoSlider ? { body: true } : el
                );
            }

            if (placementName.includes("desktop_takeover") && el) {
                el.id = "desktop-takeover";
            }
            if (placementName === "mobile_takeover" && el) {
                el.id = "mobile-takeover";
            }
        };

        const handleRemove = function (admanager: any, scope: any) {
            if (placementName === "vertical_sticky") {
                scope.Config.verticalSticky().destroy();
            } else if (placement) {
                admanager.removePlacement(placement.instance());
            }
        };

        self.__VM = self.__VM || [];
        self.__VM.push(handleAdd);

        return () => {
            self.__VM.push(handleRemove);
        };
    });
</script>

<div bind:this={el}></div>
