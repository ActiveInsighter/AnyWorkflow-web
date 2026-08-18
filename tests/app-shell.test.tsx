import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { App } from "@/app/App";
import { useUiStore } from "@/stores/ui-store";

afterEach(cleanup);

beforeEach(() => {
  useUiStore.setState({
    sidebarBehavior: "expand-on-hover",
    mobileNavigationOpen: false,
  });
});

describe("AnyWorkflow application shell", () => {
  it("renders the studio navigation and dashboard route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "工作流总览" })).toBeInTheDocument();
  });

  it("navigates from the studio sidebar to a routed module", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getAllByRole("link", { name: /工作流/ })[0]);

    expect(screen.getByRole("heading", { name: "工作流" })).toBeInTheDocument();
  });

  it("uses the clone sidebar's stable expand-on-hover behavior without a top header", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();

    const sidebar = screen.getByRole("complementary", { name: "Studio sidebar" });
    expect(sidebar).toHaveAttribute("data-behavior", "expand-on-hover");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");

    const navigation = within(sidebar).getByRole("navigation", { name: "Primary navigation" });
    const workflowLink = within(navigation).getByRole("link", { name: "工作流" });
    expect(within(workflowLink).getByText("工作流")).toBeInTheDocument();

    const iconSlots = within(navigation).getAllByTestId("sidebar-icon-slot");
    expect(iconSlots.length).toBeGreaterThan(0);
    expect(new Set(iconSlots.map((slot) => slot.className)).size).toBe(1);

    await user.hover(sidebar);
    expect(sidebar).toHaveAttribute("data-state", "expanded");

    await user.unhover(sidebar);
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    expect(screen.getByText("内容区域占位")).toBeInTheDocument();
  });

  it("opens the sidebar control and switches between all clone behaviors", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    const sidebar = screen.getByRole("complementary", { name: "Studio sidebar" });
    const control = within(sidebar).getByRole("button", { name: "侧栏设置" });

    await user.click(control);
    const menu = await screen.findByRole("menu", { name: "侧栏设置" });
    expect(control).toHaveAttribute("aria-expanded", "true");

    await user.click(within(menu).getByRole("menuitemradio", { name: "展开" }));
    expect(sidebar).toHaveAttribute("data-behavior", "expanded");
    expect(sidebar).toHaveAttribute("data-state", "expanded");

    await user.click(control);
    await user.click(await screen.findByRole("menuitemradio", { name: "收起" }));
    expect(sidebar).toHaveAttribute("data-behavior", "collapsed");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");

    await user.click(control);
    await user.click(await screen.findByRole("menuitemradio", { name: "悬停展开" }));
    expect(sidebar).toHaveAttribute("data-behavior", "expand-on-hover");
  });
});
