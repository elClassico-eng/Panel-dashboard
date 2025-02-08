import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";
import CreditCardOutlinedIcon from "@material-ui/icons/CreditCardOutlined";

import { Card } from "../../components/Setting/Card";
import { Title } from "../../components/Title/Title";

export const Settings = () => {
    return (
        <div className="p-4">
            <Title title="Settings" />
            <div className="grid gap-4 px-12 grid-cols-2 lg:grid-cols-4">
                <Card
                    title="Account"
                    subtitle="Manage profile"
                    href="#"
                    Icon={PermIdentityOutlinedIcon}
                />
                <Card
                    title="Email"
                    subtitle="Manage email"
                    href="#"
                    Icon={MailOutlineOutlinedIcon}
                />
                <Card
                    title="Team"
                    subtitle="Manage team"
                    href="#"
                    Icon={GroupOutlinedIcon}
                />
                <Card
                    title="Billing"
                    subtitle="Manage cards"
                    href="#"
                    Icon={CreditCardOutlinedIcon}
                />
            </div>
        </div>
    );
};
