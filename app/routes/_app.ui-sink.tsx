import { AccordionDemo } from '@/components/ui-sink/accordion-demo'
import { AlertDemo } from '@/components/ui-sink/alert-demo'
import { AlertDialogDemo } from '@/components/ui-sink/alert-dialog-demo'
import { AppSidebar } from '@/components/ui-sink/app-sidebar'
import { AspectRatioDemo } from '@/components/ui-sink/aspect-ratio-demo'
import { AvatarDemo } from '@/components/ui-sink/avatar-demo'
import { BadgeDemo } from '@/components/ui-sink/badge-demo'
import { BadgeDestructive } from '@/components/ui-sink/badge-destructive'
import { BadgeOutline } from '@/components/ui-sink/badge-outline'
import { BadgeSecondary } from '@/components/ui-sink/badge-secondary'
import { BreadcrumbDemo } from '@/components/ui-sink/breadcrumb-demo'
import { ButtonDemo } from '@/components/ui-sink/button-demo'
import { ButtonDestructive } from '@/components/ui-sink/button-destructive'
import { ButtonGhost } from '@/components/ui-sink/button-ghost'
import { ButtonLink } from '@/components/ui-sink/button-link'
import { ButtonLoading } from '@/components/ui-sink/button-loading'
import { ButtonOutline } from '@/components/ui-sink/button-outline'
import { ButtonSecondary } from '@/components/ui-sink/button-secondary'
import { ButtonWithIcon } from '@/components/ui-sink/button-with-icon'
import { CalendarDemo } from '@/components/ui-sink/calendar-demo'
import { CardDemo } from '@/components/ui-sink/card-demo'
import { CarouselDemo } from '@/components/ui-sink/carousel-demo'
import { CheckboxDemo } from '@/components/ui-sink/checkbox-demo'
import { CollapsibleDemo } from '@/components/ui-sink/collapsible-demo'
import { ComboboxDemo } from '@/components/ui-sink/combobox-demo'
import { CommandDemo } from '@/components/ui-sink/command-demo'
import { ComponentWrapper } from '@/components/ui-sink/component-wrapper'
import { ContextMenuDemo } from '@/components/ui-sink/context-menu-demo'
import { DatePickerDemo } from '@/components/ui-sink/date-picker-demo'
import { DialogDemo } from '@/components/ui-sink/dialog-demo'
import { DrawerDemo } from '@/components/ui-sink/drawer-demo'
import { DropdownMenuDemo } from '@/components/ui-sink/dropdown-menu-demo'
import { HoverCardDemo } from '@/components/ui-sink/hover-card-demo'
import { InputDemo } from '@/components/ui-sink/input-demo'
import { InputOTPDemo } from '@/components/ui-sink/input-otp-demo'
import { LabelDemo } from '@/components/ui-sink/label-demo'
import { MenubarDemo } from '@/components/ui-sink/menubar-demo'
import { NavigationMenuDemo } from '@/components/ui-sink/navigation-menu-demo'
import { PaginationDemo } from '@/components/ui-sink/pagination-demo'
import { PopoverDemo } from '@/components/ui-sink/popover-demo'
import { ProgressDemo } from '@/components/ui-sink/progress-demo'
import { RadioGroupDemo } from '@/components/ui-sink/radio-group-demo'
import { ResizableHandleDemo } from '@/components/ui-sink/resizable-handle'
import { ScrollAreaDemo } from '@/components/ui-sink/scroll-area-demo'
import { SelectDemo } from '@/components/ui-sink/select-demo'
import { SeparatorDemo } from '@/components/ui-sink/separator-demo'
import { SheetDemo } from '@/components/ui-sink/sheet-demo'
import { SkeletonDemo } from '@/components/ui-sink/skeleton-demo'
import { SliderDemo } from '@/components/ui-sink/slider-demo'
import { SonnerDemo } from '@/components/ui-sink/sonner-demo'
import { SwitchDemo } from '@/components/ui-sink/switch-demo'
import { TableDemo } from '@/components/ui-sink/table-demo'
import { TabsDemo } from '@/components/ui-sink/tabs-demo'
import { TextareaDemo } from '@/components/ui-sink/textarea-demo'
import { ToastDemo } from '@/components/ui-sink/toast-demo'
import { ToggleDemo } from '@/components/ui-sink/toggle-demo'
import { ToggleDisabled } from '@/components/ui-sink/toggle-disabled'
import { ToggleGroupDemo } from '@/components/ui-sink/toggle-group-demo'
import { ToggleOutline } from '@/components/ui-sink/toggle-outline'
import { ToggleWithText } from '@/components/ui-sink/toggle-with-text'
import { TooltipDemo } from '@/components/ui-sink/tooltip-demo'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/lib/ui/breadcrumb'
import { Separator } from '@/lib/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/lib/ui/sidebar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/ui-sink')({
  component: SinkPage,
})

function SinkPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ComponentWrapper name="Accordion">
              <AccordionDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Alert">
              <AlertDemo />
            </ComponentWrapper>
            <ComponentWrapper name="AlertDialog">
              <AlertDialogDemo />
            </ComponentWrapper>
            <ComponentWrapper name="AspectRatio">
              <AspectRatioDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Avatar">
              <AvatarDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Badge">
              <BadgeDemo />
              <BadgeDestructive />
              <BadgeOutline />
              <BadgeSecondary />
            </ComponentWrapper>
            <ComponentWrapper name="Breadcrumb">
              <BreadcrumbDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Button">
              <div className="flex items-center gap-2">
                <ButtonDemo />
                <ButtonDestructive />
                <ButtonGhost />
                <ButtonLink />
              </div>
              <div className="flex items-center gap-2">
                <ButtonLoading />
                <ButtonOutline />
                <ButtonSecondary />
              </div>
              <div className="flex items-center gap-2">
                <ButtonWithIcon />
              </div>
            </ComponentWrapper>
            <ComponentWrapper name="Calendar">
              <CalendarDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Card">
              <CardDemo className="w-full" />
            </ComponentWrapper>
            <ComponentWrapper
              name="Carousel"
              className="[&_.max-w-xs]:max-w-[70%]"
            >
              <CarouselDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Checkbox">
              <CheckboxDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Collapsible">
              <CollapsibleDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Combobox">
              <ComboboxDemo />
            </ComponentWrapper>
            <ComponentWrapper
              name="Command"
              className="[&_[cmdk-root]]:md:min-w-max"
            >
              <CommandDemo />
            </ComponentWrapper>
            <ComponentWrapper name="ContextMenu">
              <ContextMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name="DatePicker">
              <DatePickerDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Dialog">
              <DialogDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Drawer">
              <DrawerDemo />
            </ComponentWrapper>
            <ComponentWrapper name="DropdownMenu">
              <DropdownMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name="HoverCard">
              <HoverCardDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Input">
              <InputDemo />
            </ComponentWrapper>
            <ComponentWrapper name="InputOTP">
              <InputOTPDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Label">
              <LabelDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Menubar">
              <MenubarDemo />
            </ComponentWrapper>
            <ComponentWrapper name="NavigationMenu" className="col-span-2">
              <NavigationMenuDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Pagination">
              <PaginationDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Popover">
              <PopoverDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Progress">
              <ProgressDemo />
            </ComponentWrapper>
            <ComponentWrapper name="RadioGroup">
              <RadioGroupDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Resizable" className="col-span-2">
              <ResizableHandleDemo />
            </ComponentWrapper>
            <ComponentWrapper name="ScrollArea">
              <ScrollAreaDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Select">
              <SelectDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Separator">
              <SeparatorDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Sheet">
              <SheetDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Skeleton">
              <SkeletonDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Slider">
              <SliderDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Sonner">
              <SonnerDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Switch">
              <SwitchDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Table" className="col-span-2">
              <TableDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Tabs">
              <TabsDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Textarea">
              <TextareaDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Toast">
              <ToastDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Toggle">
              <div className="flex items-center gap-2">
                <ToggleDemo />
                <ToggleDisabled />
                <ToggleOutline />
                <ToggleWithText />
              </div>
            </ComponentWrapper>
            <ComponentWrapper name="ToggleGroup">
              <ToggleGroupDemo />
            </ComponentWrapper>
            <ComponentWrapper name="Tooltip">
              <TooltipDemo />
            </ComponentWrapper>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
